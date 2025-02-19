import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ActionButtons from '../components/ActionButtons';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, arrayUnion, getDoc } from 'firebase/firestore';  
import { useConfigData } from '../hooks/useConfigData';
import ItemFormModal from '../components/ItemFormModal';
import { CURRENCIES } from '../hooks/useConfigData';
import { useTableStyles } from '../components/Table/useTableStyles';
import { useToast } from '../context/ToastContext';

function BundleSettingsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { 
    loading, 
    setLoading, 
    error, 
    setError, 
    processedItems, 
    packages, 
    setProcessedItems,
    items,
    updateItemPrice,
    saveItems,
    updateItemInTree,
    handleNewItem,
    handleDeleteItem,
    loadItemsForCurrency,
    loadCategoriesForCurrency,
    processCategories
  } = useConfigData();
  const { showToast } = useToast();

  const [bundlesState, setBundlesState] = useState([]);
  const [itemPrices, setItemPrices] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [isItemSaving, setIsItemSaving] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('CZK');

  // Initialize bundles state from packages
  useEffect(() => {
    if (packages.length) {
      setBundlesState(packages.map(pkg => ({
        ...pkg,
        note: pkg.note || '',
        items: items.reduce((acc, item) => ({
          ...acc,
          [item.id]: {
            selected: false,
            price: item.packages?.find(p => p.packageId === pkg.id)?.price || 0
          }
        }), {})
      })));
    }
  }, [packages, items]);

  // Load items based on selected currency
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [items, categories] = await Promise.all([
          loadItemsForCurrency(selectedCurrency),
          loadCategoriesForCurrency(selectedCurrency)
        ]);
        const processedTree = processCategories(categories, items);
        setProcessedItems(processedTree);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCurrency, setLoading, setError, setProcessedItems, loadItemsForCurrency, loadCategoriesForCurrency]);

  // 2. Simplify the handlers using the shared function
  const handleItemDiscountChange = useCallback((bundleId, itemId, discountedAmount) => {
    updateItemPrice(bundleId, itemId, {
      discountedAmount: Number(discountedAmount)
    });
  }, [updateItemPrice]);
  
  const handleItemToggle = useCallback((bundleId, itemId) => {
    setProcessedItems(prevItems => 
      updateItemInTree(prevItems, itemId, (item) => {
        const selected = item.packages?.find(p => p.packageId === bundleId)?.selected;
        const newPackages = [...(item.packages || [])];
        const packageIndex = newPackages.findIndex(p => p.packageId === bundleId);
        
        if (packageIndex >= 0) {
          newPackages[packageIndex] = {
            ...newPackages[packageIndex],
            selected: !selected
          };
        } else {
          newPackages.push({
            packageId: bundleId,
            price: 0,
            selected: true,
            note: ''
          });
        }
        
        return { ...item, packages: newPackages };
      })
    );
  });
  
  const handleItemPriceChange = useCallback((bundleId, itemId, price) => {
    setItemPrices(prev => ({
      ...prev,
      [`${itemId}-${bundleId}`]: price
    }));
    
    updateItemPrice(bundleId, itemId, {
      price: Number(price)
    });
  }, [updateItemPrice]);

  // Add new handler for userLimit changes
  const handleUserLimitChange = useCallback((bundleId, limit) => {
    setBundlesState(prevBundles => 
      prevBundles.map(bundle => 
        bundle.id === bundleId 
          ? { ...bundle, userLimit: Number(limit) }
          : bundle
      )
    );
  });

  // Add handler for note changes
  const handleNoteChange = useCallback((bundleId, note) => {
    setBundlesState(prevBundles => 
      prevBundles.map(bundle => 
        bundle.id === bundleId 
          ? { ...bundle, note }
          : bundle
      )
    );
  });

  // Modify the save function to include userLimit and currency
  const handleSave = async () => {
    setLoading(true);
    setError('');
    showToast('Saving changes...', 'info');
    
    try {
      // Save items using the hook's method with currency
      await saveItems(processedItems, selectedCurrency);

      // Save packages with userLimit and note
      const updatedPackages = bundlesState.map(({ id, name, userLimit, note }) => ({
        id,
        name,
        userLimit: userLimit || 0,
        note: note || ''
      }));
      await updateDoc(doc(db, 'default', 'packages'), { packages: updatedPackages });

      showToast('Changes saved successfully!', 'success');
      userId && navigate(`/users/${userId}/bundles`);
    } catch (err) {
      console.error('Error saving bundles:', err);
      showToast('Failed to save changes. Please try again.', 'error');
      setError('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update the handleItemSubmit function
  const handleItemSubmit = useCallback(async (formData) => {
    setIsItemSaving(true);
    showToast('Saving item...', 'info');
    try {
      // Validate required fields
      if (!formData.name) {
        throw new Error('Name is required');
      }

      // Validate packages if it's an item
      if (formData.type === 'item') {
        const hasValidPackage = formData.packages.some(pkg => pkg.selected);
        if (!hasValidPackage) {
          throw new Error('At least one package must be selected');
        }
      }

      // Prepare category data if it's a category
      if (formData.type === 'category') {
        const categoryData = {
          ...formData,
          id: formData.id || Date.now(),
          name: formData.name,
          type: 'category',
          parentId: formData.categoryId ? Number(formData.categoryId) : null,
          order: formData.order || 1,
          excludeFromGlobalDiscount: formData.excludeFromGlobalDiscount || false,
          children: []
        };
        formData = categoryData;

        // If excludeFromGlobalDiscount is true, update all items in this category
        if (formData.excludeFromGlobalDiscount) {
          const updateItemsInCategory = (items, targetCategoryId) => {
            return items.map(item => {
              if (item.type === 'category') {
                if (item.id === targetCategoryId) {
                  // If this is our target category, update all its children
                  return {
                    ...item,
                    excludeFromGlobalDiscount: true,
                    children: item.children?.map(child => ({
                      ...child,
                      excludeFromGlobalDiscount: true
                    }))
                  };
                }
                // If not our target, recursively check children
                return {
                  ...item,
                  children: updateItemsInCategory(item.children || [], targetCategoryId)
                };
              }
              // For items directly in the target category
              if (item.categoryId === targetCategoryId) {
                return {
                  ...item,
                  excludeFromGlobalDiscount: true
                };
              }
              return item;
            });
          };

          const updatedItems = updateItemsInCategory(processedItems, formData.id);
          await saveItems(updatedItems, selectedCurrency);
        }
      }

      const result = await handleNewItem(formData, selectedCurrency);
      if (!result) {
        throw new Error('Failed to save item - no result returned');
      }
      
      showToast('Item saved successfully!', 'success');
      setShowItemModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving item:', err);
      showToast(err instanceof Error ? err.message : 'Failed to save item. Please try again.', 'error');
      setError(err instanceof Error ? err.message : 'Failed to save item. Please try again.');
    } finally {
      setIsItemSaving(false);
    }
  }, [handleNewItem, selectedCurrency, showToast]);

  // Add handler for excluding category from global discount
  const handleCategoryGlobalDiscountExclusion = useCallback(async (categoryId, exclude) => {
    setLoading(true);
    try {
      // Update all items in the category recursively
      const updateItemsInCategory = (items, targetCategoryId) => {
        return items.map(item => {
          if (item.type === 'category') {
            if (item.id === targetCategoryId) {
              // If this is our target category, update all its children
              return {
                ...item,
                excludeFromGlobalDiscount: exclude,
                children: item.children?.map(child => ({
                  ...child,
                  excludeFromGlobalDiscount: exclude
                }))
              };
            }
            // If not our target, recursively check children
            return {
              ...item,
              children: updateItemsInCategory(item.children || [], targetCategoryId)
            };
          }
          // For items directly in the target category
          if (item.categoryId === targetCategoryId) {
            return {
              ...item,
              excludeFromGlobalDiscount: exclude
            };
          }
          return item;
        });
      };

      const updatedItems = updateItemsInCategory(processedItems, categoryId);
      setProcessedItems(updatedItems);
      
      // Save the updated items
      await saveItems(updatedItems, selectedCurrency);
    } catch (err) {
      console.error('Error updating category global discount exclusion:', err);
      setError('Failed to update category global discount settings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [processedItems, saveItems, selectedCurrency, setError, setLoading]);

  // Add missing handlers
  const handleEditItem = useCallback((item) => {
    setEditingItem(item);
    setShowItemModal(true);
  });

  const handleAddNewItem = useCallback(() => {
    setEditingItem(null);
    setShowItemModal(true);
  });

  const handleCheckboxChange = useCallback((itemId) => {
    setProcessedItems(prevItems => 
      updateItemInTree(prevItems, itemId, (item) => ({
        ...item,
        checkbox: !item.checkbox
      }))
    );
  });

  const handleIndividualChange = useCallback((itemId) => {
    setProcessedItems(prevItems => 
      updateItemInTree(prevItems, itemId, (item) => ({
        ...item,
        individual: !item.individual
      }))
    );
  });

  // Update handleItemDelete function to include currency
  const handleItemDelete = useCallback(async (itemId) => {
    setIsItemSaving(true);
    showToast('Deleting item...', 'info');
    try {
      await handleDeleteItem(itemId, selectedCurrency);
      showToast('Item deleted successfully!', 'success');
      setShowItemModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      showToast('Failed to delete item. Please try again.', 'error');
      setError('Failed to delete item. Please try again.');
    } finally {
      setIsItemSaving(false);
    }
  }, [handleDeleteItem, selectedCurrency, showToast]);

  // Add handler for note changes
  const handleItemNoteChange = useCallback((bundleId, itemId, note) => {
    setProcessedItems(prevItems => 
      updateItemInTree(prevItems, itemId, (item) => {
        const newPackages = [...(item.packages || [])];
        const packageIndex = newPackages.findIndex(p => p.packageId === bundleId);
        
        if (packageIndex >= 0) {
          newPackages[packageIndex] = {
            ...newPackages[packageIndex],
            note
          };
        } else {
          newPackages.push({
            packageId: bundleId,
            price: 0,
            selected: false,
            note
          });
        }
        
        return { ...item, packages: newPackages };
      })
    );
  }, [updateItemInTree]);

  // Add handler for category global discount exclusion
  const handleCategoryGlobalDiscountChange = (categoryId, exclude) => {
    handleCategoryGlobalDiscountExclusion(categoryId, exclude);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Section */}
        <header className="bg-white shadow-sm">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {userId ? 'Create New Bundle for User' : 'Nastavení balíčků'}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="currency" className="text-sm font-medium text-gray-700 w-full">
                    Jazyk balíčku:
                  </label>
                  <select
                    id="currency"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className={useTableStyles().currencySelect}
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-auto bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : (
            <div className="p-2 md:p-6 min-w-full">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <BundleTable
                    bundles={bundlesState}
                    items={processedItems}
                    onItemToggle={handleItemToggle}
                    onItemPriceChange={handleItemPriceChange}
                    onItemDiscountChange={handleItemDiscountChange}
                    onUserLimitChange={handleUserLimitChange}
                    onEditItem={handleEditItem}
                    onCheckboxChange={handleCheckboxChange}
                    onIndividualChange={handleIndividualChange}
                    itemPrices={itemPrices}
                    onAddNewItem={handleAddNewItem}
                    onNoteChange={handleNoteChange}
                    onItemNoteChange={handleItemNoteChange}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <ItemFormModal
        show={showItemModal}
        onClose={() => setShowItemModal(false)}
        onSubmit={handleItemSubmit}
        onDelete={handleItemDelete}
        items={processedItems}
        packages={packages}
        editingItem={editingItem}
        isLoading={isItemSaving}
      />
    </div>
  );
}


function BundleTable({ 
  bundles, 
  items, 
  onItemToggle, 
  onItemPriceChange, 
  onItemDiscountChange, 
  onUserLimitChange,
  onEditItem,
  onCheckboxChange,
  onIndividualChange,
  itemPrices,
  onAddNewItem,
  onNoteChange,
  onItemNoteChange
}) {
  const flattenedItems = useMemo(() => flattenItems(items), [items]);
  // Add border color array
  const abraColors = [
    'abraYellow',
    'abraOrange',
    'abraMagenta',
  ];
  

  const getBundleBorderClasses = (index) => `
    border-l-2 border-r-2
    border-${abraColors[index % abraColors.length]}
    relative
    after:absolute after:content-[''] after:left-2 after:right-2 after:top-0 
    after:border-t after:border-dotted after:border-gray-200
  `;

  const getBundleHeaderBorderClasses = (index) => `
    border-l-2 border-r-2 border-t-2
    border-${abraColors[index % abraColors.length]}
  `;

  const tableStyles = { 
    headerCell: "px-0.5 py-1 text-xs font-medium text-black uppercase tracking-wider",
    packageHeaderCell: "px-0.5 py-1 text-xs font-medium text-black uppercase tracking-wider",
    bodyCell: "px-0.5 py-1",
    packageBodyCell: "px-0.5 py-1",
    checkbox: "checkbox h-4 w-4 rounded border-gray-300 focus:ring-offset-0",
    numberInput: "input w-16 md:w-20 rounded-sm text-xs text-center appearance-auto block rounded-md border-0 py-1",
    centerWrapper: "flex justify-center items-center h-full",
    columnWidths: {
      details: "w-40 min-w-[100px]",
      checkbox: "w-5",
      individual: "w-5",
      globalDiscount: "w-5",
      bundle: "w-10",
    }
  };

  const getItemPrice = useCallback((item, bundleId) => {
    const localPrice = itemPrices[`${item.id}-${bundleId}`];
    if (localPrice !== undefined) return localPrice;
    return item.packages?.find(p => p.packageId === bundleId)?.price ?? 0;
  }, [itemPrices]);

  const getItemSelected = useCallback((item, bundleId) => {
    return item.packages?.find(p => p.packageId === bundleId)?.selected ?? false;
  });

  const getItemDiscountedAmount = useCallback((item, bundleId) => {
    return item.packages?.find(p => p.packageId === bundleId)?.discountedAmount ?? 0;
  });

  // Create a shared colgroup component
  const TableColgroup = () => (
    <colgroup>
      <col className={tableStyles.columnWidths.details} />
      <col className={tableStyles.columnWidths.checkbox} />
      <col className={tableStyles.columnWidths.individual} />
      <col className={tableStyles.columnWidths.globalDiscount} />
      {bundles.map((bundle, index) => (
        <React.Fragment key={`${bundle.id}-group`}>
          <col className="w-[10px]" />
          <col className={`${tableStyles.columnWidths.bundle} ${getBundleBorderClasses(index)}`} />
        </React.Fragment>
      ))}
    </colgroup>
  );

  return (
    <>
      <div className="mb-4">
        <button
          onClick={onAddNewItem}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Přidat novou položku
        </button>
      </div>
      <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <TableColgroup />
          <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
            <tr>
              <th className={`${tableStyles.columnWidths.details} text-left ${tableStyles.headerCell}`}>
                Detail položky
              </th>
              <th className={tableStyles.headerCell}>
                <div className={tableStyles.centerWrapper}>
                  Ano/Ne
                </div>
              </th>
              <th className={tableStyles.headerCell}>
                <div className={tableStyles.centerWrapper}>
                  Individuální
                </div>
              </th>
              <th className={tableStyles.headerCell}>
                <div className={tableStyles.centerWrapper}>
                  Bez glob. slevy
                </div>
              </th>
              {bundles.map((bundle, index) => (
                <React.Fragment key={`${bundle.id}-header`}>
                  <th className="w-[10px]" />
                  <th className={`${tableStyles.packageHeaderCell} ${getBundleHeaderBorderClasses(index)}`}>
                    <div className="flex flex-col items-center">
                      <div className="text-xs truncate max-w-[80px]">{bundle.name}</div>
                      <div className="flex gap-2 text-[9px] mt-1">
                        <span>Cena</span>
                        <span>Sleva</span>
                      </div>
                    </div>
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-0">
            {/* Add user limit row */}
            <tr className="">
              <td className={`${tableStyles.columnWidths.details} ${tableStyles.bodyCell}`}>
                <span className="font-small text-gray-700 text-sm">
                  Limit uživatelů v balíčku
                </span>
              </td>
              <td className={tableStyles.bodyCell} />
              <td className={tableStyles.bodyCell} />
              <td className={tableStyles.bodyCell} />
              {bundles.map((bundle, index) => (
                <React.Fragment key={`${bundle.id}-limit`}>
                  <td className="w-[10px]" />
                  <td className={`${tableStyles.columnWidths.bundle} ${tableStyles.packageBodyCell} ${getBundleBorderClasses(index)}`}>
                    <div className={tableStyles.centerWrapper}>
                      <input
                        type="number"
                        min={0}
                        value={bundle.userLimit || 0}
                        onChange={(e) => onUserLimitChange(bundle.id, e.target.value)}
                        className={tableStyles.numberInput}
                        readOnly
                      />
                    </div>
                  </td>
                </React.Fragment>
              ))}
            </tr>
            {flattenedItems.map((item) => (
              <tr 
                key={item.uniqueId}
                className={`
                  ${item.type === 'category' ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50/70 transition-colors duration-150'}
                  ${item.depth > 0 ? `pl-${item.depth * 4}` : ''}
                `}
              >
                <td className={`${tableStyles.columnWidths.details} ${tableStyles.bodyCell}`}>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.name}</span>
                      </div>
                      {item.note && (
                        <span className="text-xs text-gray-500 block break-words">
                          {item.note}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditItem(item)}
                        className={`p-1 ${item.type === 'category' ? 'text-blue-500 hover:text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </td>
                <td className={`${tableStyles.columnWidths.checkbox} ${tableStyles.bodyCell}`}>
                  <div className={tableStyles.centerWrapper}>
                    {item.type === 'item' && (
                      <input
                        type="checkbox"
                        checked={item.checkbox ?? false}
                        className={tableStyles.checkbox}
                        disabled
                      />
                    )}
                  </div>
                </td>
                <td className={`${tableStyles.columnWidths.individual} ${tableStyles.bodyCell}`}>
                  <div className={tableStyles.centerWrapper}>
                    {item.type === 'item' && (
                      <input
                        type="checkbox"
                        checked={item.individual ?? false}
                        onChange={() => onIndividualChange(item.id)}
                        className={tableStyles.checkbox}
                        disabled
                      />
                    )}
                  </div>
                </td>
                <td className={`${tableStyles.columnWidths.globalDiscount} ${tableStyles.bodyCell}`}>
                  <div className={tableStyles.centerWrapper}>
                    <input
                      type="checkbox"
                      checked={item.excludeFromGlobalDiscount ?? false}
                      onChange={(e) => handleCategoryGlobalDiscountChange(item.id, e.target.checked)}
                      className={tableStyles.checkbox}
                      disabled
                    />
                  </div>
                </td>
                {bundles.map((bundle, index) => (
                  <React.Fragment key={`${item.id}-${bundle.id}-group`}>
                    <td className="w-[10px]" />
                    <td className={`${tableStyles.columnWidths.bundle} ${tableStyles.packageBodyCell} ${getBundleBorderClasses(index)}`}>
                      {item.type === 'item' && (
                        <div className={tableStyles.centerWrapper + " gap-1 flex-col"}>
                          <div className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={getItemSelected(item, bundle.id)}
                              onChange={() => onItemToggle(bundle.id, item.id)}
                              className={tableStyles.checkbox}
                              disabled
                            />
                            <div className="flex flex-wrap gap-1 justify-center flex-col">
                              <input
                                type="number"
                                value={getItemPrice(item, bundle.id)}
                                onChange={(e) => onItemPriceChange(bundle.id, item.id, e.target.value)}
                                className={tableStyles.numberInput}
                                readOnly
                              />
                              <input
                                type="number"
                                value={getItemDiscountedAmount(item, bundle.id)}
                                onChange={(e) => onItemDiscountChange(bundle.id, item.id, e.target.value)}
                                className={tableStyles.numberInput}
                                readOnly
                              />
                            </div>
                          </div>
                          {item.packages?.find(p => p.packageId === bundle.id)?.note && (
                            <div className="text-xs text-gray-500 mt-1 ">
                              {item.packages?.find(p => p.packageId === bundle.id)?.note}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function flattenItems(items, depth = 0, parentId = '') {
  if (!items) return [];  // Add null check
  
  const result = [];
  
  // Sort items by order before flattening
  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  sortedItems.forEach((item, index) => {
    // Create a unique ID by combining parent path and current index
    const uniqueId = parentId ? `${parentId}-${index}` : `${index}`;
    
    // Add the item itself with all necessary properties
    result.push({
      ...item,
      uniqueId,
      depth,
      type: item.children ? 'category' : 'item',
      children: item.children || []  // Ensure children array exists
    });
    
    // Recursively add children if they exist, and sort them by order
    if (item.children && item.children.length > 0) {
      result.push(...flattenItems(item.children, depth + 1, uniqueId));
    }
  });
  
  return result;
}


export default BundleSettingsPage;