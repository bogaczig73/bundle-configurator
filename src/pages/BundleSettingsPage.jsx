import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useBundleData } from '../hooks/useBundleData';
import ActionButtons from '../components/ActionButtons';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { db } from '../firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';  
import { useConfigData } from '../hooks/useConfigData';
import { defaultItems } from '../data/items';
import { defaultCategories } from '../data/categories';
import { defaultPackages } from '../data/packages';

function BundleSettingsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { bundlesState, setBundlesState } = useBundleData();
  const { loading, setLoading, error, setError, processedItems, packages, setProcessedItems, items } = useConfigData();

  const [itemPrices, setItemPrices] = useState({});

  // Initialize bundles state from packages
  useEffect(() => {
    if (packages.length) {
      setBundlesState(packages.map(pkg => ({
        ...pkg,
        items: items.reduce((acc, item) => ({
          ...acc,
          [item.id]: {
            selected: false,
            price: item.prices?.find(p => p.packageId === pkg.id)?.price || 0
          }
        }), {})
      })));
    }
  }, [packages, items, setBundlesState]);


  // 1. Extract the recursive updateItem helper function since it's used in both handlers
  const updateItemInTree = (items, itemId, updateFn) => {
    return items.map(item => {
      if (item.type === 'category' && item.children) {
        return {
          ...item,
          children: updateItemInTree(item.children, itemId, updateFn)
        };
      }
      if (item.id === itemId) {
        return updateFn(item);
      }
      return item;
    });
  };

  // 2. Simplify the handlers using the shared function
  const handleItemToggle = useCallback((bundleId, itemId) => {
    setProcessedItems(prevItems => 
      updateItemInTree(prevItems, itemId, (item) => {
        const newPrices = [...(item.prices || [])];
        const priceIndex = newPrices.findIndex(p => p.packageId === bundleId);
        
        if (priceIndex >= 0) {
          newPrices[priceIndex] = {
            ...newPrices[priceIndex],
            selected: !newPrices[priceIndex].selected
          };
        } else {
          newPrices.push({
            packageId: bundleId,
            price: 0,
            selected: true
          });
        }
        
        return { ...item, prices: newPrices };
      })
    );
  }, []);

  const handleItemPriceChange = useCallback((bundleId, itemId, price) => {
    setItemPrices(prev => ({
      ...prev,
      [`${itemId}-${bundleId}`]: price
    }));

    setProcessedItems(prevItems => 
      updateItemInTree(prevItems, itemId, (item) => {
        const newPrices = [...(item.prices || [])];
        const priceIndex = newPrices.findIndex(p => p.packageId === bundleId);
        
        if (priceIndex >= 0) {
          newPrices[priceIndex] = {
            ...newPrices[priceIndex],
            price: Number(price)
          };
        } else {
          newPrices.push({
            packageId: bundleId,
            price: Number(price),
            selected: false
          });
        }
        
        return { ...item, prices: newPrices };
      })
    );
  }, []);

  // 3. Extract the getAllItems helper function since it's used in save
  const getAllItems = (items) => {
    return items.reduce((acc, item) => {
      if (item.type === 'item') {
        acc.push(item);
      } else if (item.children) {
        acc.push(...getAllItems(item.children));
      }
      return acc;
    }, []);
  };

  // 4. Simplify the save function
  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    try {
      const currentItems = getAllItems(processedItems);
      const updatedItems = currentItems.map(({ id, name, categoryId, prices, note, checkbox }) => ({
        id,
        name,
        categoryId,
        prices: prices || [],
        amount: 0,
        checkbox: checkbox ?? false,
        individual: false,
        ...(note && { note })
      }));

      console.log('Saving items:', updatedItems);
      await updateDoc(doc(db, 'default', 'items'), { items: updatedItems });

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
      // Upload default items
      await setDoc(doc(db, 'default', 'items'), { items: defaultItems });
      
      // Upload default categories
      await setDoc(doc(db, 'default', 'categories'), { categories: defaultCategories });
      
      // Upload default packages
      await setDoc(doc(db, 'default', 'packages'), { packages: defaultPackages });
      
      console.log('Default data loaded successfully');
    } catch (err) {
      console.error('Error loading defaults:', err);
      setError('Failed to load default data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add the handler function at the component level
  const handleCheckboxChange = useCallback((itemId) => {
    setProcessedItems(prevItems => 
      updateItemInTree(prevItems, itemId, (item) => {
        console.log('Updating checkbox for item:', item.id, 'Current value:', item.checkbox);
        return {
          ...item,
          checkbox: item.checkbox === undefined ? true : !item.checkbox
        };
      })
    );
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Section */}
        <header className="bg-white shadow-sm">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {userId ? 'Create New Bundle for User' : 'Bundle Settings'}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={handleLoadDefaults}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Load Defaults
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
                onCheckboxChange={handleCheckboxChange}
                itemPrices={itemPrices}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const MemoizedBundleTable = memo(BundleTable, (prevProps, nextProps) => {
  return (
    prevProps.bundles === nextProps.bundles &&
    prevProps.items === nextProps.items &&
    prevProps.itemPrices === nextProps.itemPrices &&
    prevProps.onCheckboxChange === nextProps.onCheckboxChange
  );
});

function BundleTable({ bundles, items, onItemToggle, onItemPriceChange, onCheckboxChange, itemPrices }) {
  const flattenedItems = useMemo(() => flattenItems(items), [items]);

  const getItemPrice = useCallback((item, bundleId) => {
    const localPrice = itemPrices[`${item.id}-${bundleId}`];
    if (localPrice !== undefined) return localPrice;
    return item.prices?.find(p => p.packageId === bundleId)?.price ?? 0;
  }, [itemPrices]);

  const getItemSelected = useCallback((item, bundleId) => {
    return item.prices?.find(p => p.packageId === bundleId)?.selected ?? false;
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <div className="min-w-[800px]">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 md:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Item Details
              </th>
              <th className="px-2 md:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                Checkbox
              </th>
              {bundles.map(bundle => (
                <th key={bundle.id} className="px-2 md:px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  {bundle.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flattenedItems.map((item) => (
              <tr 
                key={item.uniqueId}
                className={`
                  ${item.type === 'category' ? 'bg-gray-50' : 'hover:bg-gray-50'}
                  ${item.depth > 0 ? `pl-${item.depth * 4}` : ''}
                `}
              >
                <td className="px-2 md:px-4 py-2">
                  <div className="flex flex-col">
                    <span className={`${item.type === 'category' ? 'font-medium text-gray-900' : 'text-gray-700'} text-xs md:text-sm`}>
                      {item.name}
                    </span>
                    {item.note && (
                      <span className="text-xs text-gray-500 truncate max-w-xs">
                        {item.note}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 md:px-4 py-2">
                  {item.type === 'item' && (
                    <input
                      type="checkbox"
                      checked={item.checkbox ?? false}
                      onChange={() => onCheckboxChange(item.id)}
                      className="h-3 w-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  )}
                </td>
                
                {item.type === 'item' && bundles.map(bundle => (
                  <td key={`${item.id}-${bundle.id}`} className="px-2 md:px-4 py-2">
                    <div className="flex items-center gap-1 md:gap-2">
                      <input
                        type="checkbox"
                        checked={getItemSelected(item, bundle.id)}
                        onChange={() => onItemToggle(bundle.id, item.id)}
                        className="h-3 w-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        min={0}
                        onChange={(e) => onItemPriceChange(bundle.id, item.id, e.target.value)}
                        value={itemPrices[`${item.id}-${bundle.id}`] || getItemPrice(item, bundle.id)}
                        className="block w-14 md:w-16 rounded-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs py-1"
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function flattenItems(items, depth = 0, parentId = '') {
  const result = [];
  
  items.forEach((item, index) => {
    // Create a unique ID by combining parent path and current index
    const uniqueId = parentId ? `${parentId}-${index}` : `${index}`;
    
    // Add the item itself
    result.push({
      ...item,
      uniqueId, // Add uniqueId to use for keys
      depth,
      type: item.children ? 'category' : 'item'
    });
    
    // Recursively add children if they exist
    if (item.children) {
      result.push(...flattenItems(item.children, depth + 1, uniqueId));
    }
  });
  
  return result;
}

export default BundleSettingsPage;