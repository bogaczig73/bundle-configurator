import React, { useState, useEffect, useMemo } from 'react';
import { useBundleData } from '../hooks/useBundleData';
import ActionButtons from '../components/ActionButtons';
import { useBundles } from '../context/BundleContext';
import { initialBundles } from '../data/bundles';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';  

function BundleSettingsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { bundles, setBundles } = useBundles();
  const { bundlesState, setBundlesState, saveBundles } = useBundleData(initialBundles);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState({});
  const [processedItems, setProcessedItems] = useState([]);

  // Calculate flattenedItems from processedItems
  const flattenedItems = useMemo(() => {
    return flattenItems(processedItems);
  }, [processedItems]);

  // Fetch categories and items from Firebase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesRef = doc(db, 'default', "categories");
        const categoriesSnap = await getDoc(categoriesRef);
        let categoriesData = [];
        if (categoriesSnap.exists()) {
          categoriesData = categoriesSnap.data().categories || [];
        }

        // Fetch items
        const itemsRef = doc(db, 'default', "items");
        const itemsSnap = await getDoc(itemsRef);
        let itemsData = [];
        if (itemsSnap.exists()) {
          itemsData = itemsSnap.data().items || [];
        }

        setCategories(categoriesData);
        setItems(itemsData);

        // Process the data to create the tree structure
        const processedData = processCategories(categoriesData, itemsData);
        setProcessedItems(processedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to process categories and items into a tree structure
  const processCategories = (categories, items) => {
    // Helper function to build tree structure
    const buildCategoryTree = (parentId = null) => {
      const categoryChildren = categories
        .filter(cat => cat.parentId === parentId)
        .map(category => {
          // Get all items for this category
          const categoryItems = items.filter(item => item.categoryId === category.id);
          
          // Get all child categories
          const childCategories = buildCategoryTree(category.id);
          
          return {
            id: category.id,
            name: category.name,
            type: 'category',
            children: [
              ...childCategories,
              ...categoryItems.map(item => ({
                ...item,
                type: 'item',
                name: item.name,
                description: item.note || '',
                prices: item.prices
              }))
            ]
          };
        });

      return categoryChildren;
    };

    // Start building from root categories (parentId = null)
    return buildCategoryTree(null);
  };

  const handleItemToggle = (bundleId, itemId) => {
    setBundlesState(prevBundles => 
      prevBundles.map(bundle => {
        if (bundle.id !== bundleId) return bundle;
        
        const updatedItems = { ...bundle.items };
        const item = flattenedItems.find(item => item.id === itemId);
        if (!item.prices) {
          item.prices = [];
        }
        
        const priceEntry = item.prices.find(p => p.packageId === bundleId);
        if (priceEntry) {
          priceEntry.selected = !priceEntry.selected;
        } else {
          item.prices.push({
            packageId: bundleId,
            price: 0,
            selected: true
          });
        }
        
        return {
          ...bundle,
          items: updatedItems
        };
      })
    );
  };

  const handleItemPriceChange = (bundleId, itemId, price) => {
    setBundlesState(prevBundles => 
      prevBundles.map(bundle => {
        if (bundle.id !== bundleId) return bundle;
        
        const updatedItems = { ...bundle.items };
        const item = flattenedItems.find(item => item.id === itemId);
        if (!item.prices) {
          item.prices = [];
        }
        
        const priceEntry = item.prices.find(p => p.packageId === bundleId);
        if (priceEntry) {
          priceEntry.price = Number(price);
        } else {
          item.prices.push({
            packageId: bundleId,
            price: Number(price),
            selected: false
          });
        }
        
        return {
          ...bundle,
          items: updatedItems
        };
      })
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    try {
      const itemsRef = doc(db, 'default', 'items');
      
      // Convert the flattened items back to the desired structure
      const updatedItems = flattenedItems
        .filter(item => item.type === 'item') // Only process actual items, not categories
        .map(item => {
          // Create the base object with required fields
          const itemData = {
            id: item.id,
            amount: 0,
            toggle: false,
            individual: false,
            name: item.name,
            categoryId: item.categoryId,
            prices: item.prices || []
          };

          // Only add note if it exists and is not undefined/null
          if (item.note) {
            itemData.note = item.note;
          }

          return itemData;
        });

      // Update the items in Firebase
      await updateDoc(itemsRef, {
        items: updatedItems
      });

      // Show success message or redirect
      if (userId) {
        navigate(`/users/${userId}/bundles`);
      }
    } catch (err) {
      console.error('Error saving bundles:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Section */}
        <header className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {userId ? 'Create New Bundle for User' : 'Bundle Settings'}
              </h1>
              <ActionButtons
                userId={userId}
                loading={loading}
                onSave={handleSave}
              />
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
            <div className="p-6">
              <BundleTable
                bundles={bundlesState}
                items={processedItems}
                onItemToggle={handleItemToggle}
                onItemPriceChange={handleItemPriceChange}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function BundleTable({ bundles, items, onItemToggle, onItemPriceChange }) {
  const flattenedItems = flattenItems(items);

  const getItemPrice = (item, bundleId) => {
    if (!item.prices) return 0;
    const priceEntry = item.prices.find(p => p.packageId === bundleId);
    return priceEntry?.price ?? 0;
  };

  const getItemSelected = (item, bundleId) => {
    if (!item.prices) return false;
    const priceEntry = item.prices.find(p => p.packageId === bundleId);
    return priceEntry?.selected ?? false;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Item Details
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Toggle</th>
            {bundles.map(bundle => (
              <th key={bundle.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
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
              <td className="px-4 py-2">
                <div className="flex flex-col">
                  <span className={`${item.type === 'category' ? 'font-medium text-gray-900' : 'text-gray-700'} text-sm`}>
                    {item.name}
                  </span>
                  {item.note && (
                    <span className="text-xs text-gray-500 truncate max-w-xs">
                      {item.note}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-2 text-xs text-gray-500">{item.toggle ? '✓' : '–'}</td>
              
              {item.type === 'item' && bundles.map(bundle => (
                <td key={`${item.id}-${bundle.id}`} className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={getItemSelected(item, bundle.id)}
                      onChange={() => onItemToggle(bundle.id, item.id)}
                      className="h-3 w-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={getItemPrice(item, bundle.id)}
                      onChange={(e) => onItemPriceChange(bundle.id, item.id, e.target.value)}
                      className="block w-16 rounded-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs py-1"
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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