import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ActionButtons from '../components/ActionButtons';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, arrayUnion, getDoc } from 'firebase/firestore';  
import { useConfigData } from '../hooks/useConfigData';
import { getDefaultItemsForCurrency } from '../data/items';
import { defaultCategories } from '../data/categories';
import { defaultPackages } from '../data/packages';
import ItemFormModal from '../components/ItemFormModal';
import { CURRENCIES } from '../hooks/useConfigData';
import { useTableStyles } from '../components/Table/useTableStyles';

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
    getAllItems,
    handleNewItem,
    handleDeleteItem,
    loadItemsForCurrency
  } = useConfigData();

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
    const loadItems = async () => {
      setLoading(true);
      try {
        const items = await loadItemsForCurrency(selectedCurrency);
        setProcessedItems(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [selectedCurrency, setLoading, setError, setProcessedItems, loadItemsForCurrency]);

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
            selected: true
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

  // Modify the save function to include userLimit and currency
  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Save items using the hook's method with currency
      await saveItems(processedItems, selectedCurrency);

      // Save packages with userLimit
      const updatedPackages = bundlesState.map(({ id, name, userLimit }) => ({
        id,
        name,
        userLimit: userLimit || 0
      }));
      await updateDoc(doc(db, 'default', 'packages'), { packages: updatedPackages });

      userId && navigate(`/users/${userId}/bundles`);
    } catch (err) {
      console.error('Error saving bundles:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDefaults = async () => {
    setLoading(true);
    setError('');
    
    try {
      const defaultItemsForCurrency = getDefaultItemsForCurrency(selectedCurrency);
      
      // Upload default items for the selected currency
      await setDoc(doc(db, 'default', `items_${selectedCurrency.toLowerCase()}`), { 
        items: defaultItemsForCurrency,
        currency: selectedCurrency
      });
      
      // Upload default categories
      await setDoc(doc(db, 'default', 'categories'), { categories: defaultCategories });
      
      // Upload default packages
      await setDoc(doc(db, 'default', 'packages'), { packages: defaultPackages });
      
      console.log('Default data loaded successfully for currency:', selectedCurrency);
      
      // Load items with categories using the hook's function
      const items = await loadItemsForCurrency(selectedCurrency);
      setProcessedItems(items);
    } catch (err) {
      console.error('Error loading defaults:', err);
      setError('Failed to load default data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update the handleItemSubmit function
  const handleItemSubmit = useCallback(async (formData) => {
    setIsItemSaving(true);
    try {
      await handleNewItem(formData, selectedCurrency);
      // Reload items after saving
      const updatedItems = await loadItemsForCurrency(selectedCurrency);
      setProcessedItems(updatedItems);
      setShowItemModal(false);
      setEditingItem(null);
    } catch (err) {
      setError('Failed to save item. Please try again.');
    } finally {
      setIsItemSaving(false);
    }
  }, [handleNewItem, setError, selectedCurrency, loadItemsForCurrency, setProcessedItems]);

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

  // Update handleItemDelete function
  const handleItemDelete = useCallback(async (itemId) => {
    setIsItemSaving(true);
    try {
      await handleDeleteItem(itemId);
      // Reload items for current currency after deletion
      const updatedItems = await loadItemsForCurrency(selectedCurrency);
      setProcessedItems(updatedItems);
      setShowItemModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    } finally {
      setIsItemSaving(false);
    }
  }, [handleDeleteItem, setError, loadItemsForCurrency, selectedCurrency, setProcessedItems]);

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
                <button
                  onClick={handleLoadDefaults}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Načíst základní nastavení
                </button>
                <ActionButtons
                  userId={userId}
                  loading={loading}
                  onSave={handleSave}
                />
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
        <main className="flex-1 overflow-auto bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : (
            <div className="p-2 md:p-6">
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
              />
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
  onAddNewItem
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
    numberInput: "input w-20 md:w-24 rounded-sm text-xs text-center appearance-auto block rounded-md border-0 py-1",
    centerWrapper: "flex justify-center items-center h-full",
    columnWidths: {
      details: "w-40 min-w-[100px]",
      checkbox: "w-10",
      individual: "w-10",
      bundle: "w-24",
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
      <div className="border border-gray-200 rounded-lg shadow-sm">
        <div className="min-w-[800px]">
          <table className="w-full table-fixed">
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
                {bundles.map((bundle, index) => (
                  <React.Fragment key={`${bundle.id}-header`}>
                    <th className="w-[20px]" />
                    <th className={`${tableStyles.packageHeaderCell} ${getBundleHeaderBorderClasses(index)}`}>
                      <div className="flex flex-col items-center">
                        <div>{bundle.name}</div>
                        <div className="flex gap-4 text-[10px] mt-1">
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
                {bundles.map((bundle, index) => (
                  <React.Fragment key={`${bundle.id}-limit`}>
                    <td className="w-[20px]" />
                    <td className={`${tableStyles.columnWidths.bundle} ${tableStyles.packageBodyCell} ${getBundleBorderClasses(index)}`}>
                      <div className={tableStyles.centerWrapper}>
                        <input
                          type="number"
                          min={0}
                          value={bundle.userLimit || 0}
                          onChange={(e) => onUserLimitChange(bundle.id, e.target.value)}
                          className={tableStyles.numberInput}
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
                    ${item.type === 'category' ? 'bg-gray-50' : 'hover:bg-gray-50/70 transition-colors duration-150'}
                    ${item.depth > 0 ? `pl-${item.depth * 4}` : ''}
                  `}
                >
                  <td className={`${tableStyles.columnWidths.details} ${tableStyles.bodyCell}`}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <span className="text-sm">{item.name}</span>
                        {item.note && (
                          <span className="text-xs text-gray-500 block break-words">
                            {item.note}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => onEditItem(item)}
                        className={`p-1 ${item.type === 'category' ? 'text-blue-500 hover:text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
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
                  {bundles.map((bundle, index) => (
                    <React.Fragment key={`${item.id}-${bundle.id}-group`}>
                      <td className="w-[20px]" />
                      <td className={`${tableStyles.columnWidths.bundle} ${tableStyles.packageBodyCell} ${getBundleBorderClasses(index)}`}>
                        {item.type === 'item' && (
                          <div className={tableStyles.centerWrapper + " gap-2"}>
                            <input
                              type="checkbox"
                              checked={getItemSelected(item, bundle.id)}
                              onChange={() => onItemToggle(bundle.id, item.id)}
                              className={tableStyles.checkbox}
                              disabled
                            />
                            <div className="flex gap-2">
                              <span className={tableStyles.numberInput}>
                                {getItemPrice(item, bundle.id)}
                              </span>
                              <span className={tableStyles.numberInput}>
                                {getItemDiscountedAmount(item, bundle.id)}
                              </span>
                            </div>
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
      </div>
    </>
  );
}

function flattenItems(items, depth = 0, parentId = '') {
  if (!items) return [];  // Add null check
  
  const result = [];
  
  items.forEach((item, index) => {
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
    
    // Recursively add children if they exist
    if (item.children && item.children.length > 0) {
      result.push(...flattenItems(item.children, depth + 1, uniqueId));
    }
  });
  
  return result;
}


export default BundleSettingsPage;