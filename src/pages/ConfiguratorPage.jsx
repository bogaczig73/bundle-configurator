import React, { useState, useEffect } from "react";
import { useBundles } from "../context/BundleContext";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

function BundleTable({ bundles, items, onItemToggle, onItemPriceChange, onAmountChange, amounts }) {
  const flattenedItems = flattenItems(items);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getItemPrice = (item, bundleId) => {
    if (!item.prices) return 0;
    const priceEntry = item.prices.find(p => p.packageId === bundleId);
    return priceEntry?.price ?? 0;
  };

  // Add this function to calculate bundle totals
  const calculateBundleTotal = (bundleId) => {
    return flattenedItems
      .filter(item => item.type === 'item')
      .reduce((total, item) => {
        return total + (getItemPrice(item, bundleId) * (amounts[item.id] || 0));
      }, 0);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
              Item Details
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Amount</th>
            {bundles.map(bundle => (
              <th key={bundle.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                <div className="flex flex-col">
                  <span>{bundle.name}</span>
                  <span className="text-blue-600 font-semibold">
                    Total: {formatPrice(calculateBundleTotal(bundle.id))}
                  </span>
                </div>
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
              <td className="px-4 py-2">
                {item.type === 'item' && (
                  <input
                    type="number"
                    value={amounts[item.id] || 0}
                    onChange={(e) => onAmountChange(item.id, e.target.value)}
                    className="block w-16 rounded-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs py-1"
                  />
                )}
              </td>
              
              {item.type === 'item' && bundles.map(bundle => (
                <td key={`${item.uniqueId}-${bundle.id}`} className="px-4 py-2">
                  <div className="flex flex-col">
                    <span className="block w-16 text-xs py-1 text-gray-500">
                      {formatPrice(getItemPrice(item, bundle.id))} each
                    </span>
                    <span className="block w-16 text-xs py-1 text-gray-700 font-medium">
                      {formatPrice(getItemPrice(item, bundle.id) * (amounts[item.id] || 0))} total
                    </span>
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

function ConfiguratorPage() {
  const { bundles } = useBundles();
  // const [amounts, setAmounts] = useState(() => JSON.parse(localStorage.getItem('amounts')) || {});
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const bundleId = new URLSearchParams(location.search).get('bundleId');
  const [currentBundle, setCurrentBundle] = useState(null);
  const [amounts, setAmounts] = useState({});
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState({});
  const [processedItems, setProcessedItems] = useState([]);


  const handleItemToggle = (bundleId, itemId) => {
    // Implementation similar to BundleSettingsPage
  };
  
  const handleItemPriceChange = (bundleId, itemId, price) => {
    // Implementation similar to BundleSettingsPage
  };

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
        console.log('itemsData', itemsData);
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

  const processCategories = (categories, items) => {
    const buildCategoryTree = (parentId = null) => {
      const categoryChildren = categories
        .filter(cat => cat.parentId === parentId)
        .map(category => {
          const categoryItems = items.filter(item => item.categoryId === category.id);
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

    return buildCategoryTree(null);
  };

  const handleAmountChange = (itemId, amount) => {
    setAmounts(prev => ({ ...prev, [itemId]: Number(amount) }));
  };

 

  // const handleSaveBundle = async () => {
  //   setLoading(true);
  //   try {
  //     if (userId && bundleId && currentBundle) {
  //       const bundleRef = doc(db, 'bundles', bundleId);

  //       const updatedPackages = currentBundle.packages.map(pkg => ({
  //         ...pkg,
  //         items: formatBundleItems(pkg.items, amounts),
  //         totalPrice: calculatePackageTotal(pkg.id, formatBundleItems(pkg.items, amounts))
  //       }));
  //       // console.log('updatedPackages', JSON.stringify(updatedPackages, null, 2));

  //       await updateDoc(bundleRef, {
  //         packages: updatedPackages,
  //         status: 'completed'
  //       });

  //       const userRef = doc(db, 'users', userId);
  //       await updateDoc(userRef, {
  //         bundleIds: arrayUnion(bundleId)
  //       });

  //       alert('Bundle saved successfully!');
  //     }
  //   } catch (err) {
  //     console.error('Error saving bundle:', err);
  //     setError('Failed to save bundle: ' + err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const ActionButtons = () => (
  //   <div className="flex gap-2">
  //     {userId ? (
  //       <>
  //         <button
  //           onClick={handleSaveBundle}
  //           disabled={loading}
  //           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
  //         >
  //           {loading ? 'Saving...' : 'Save Bundle for User'}
  //         </button>
  //         <Link
  //           to="/users"
  //           className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
  //         >
  //           Cancel
  //         </Link>
  //       </>
  //     ) : (
  //       <>
  //         <Link 
  //           to="/bundles"
  //           className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
  //         >
  //           Bundle Settings
  //         </Link>
  //       </>
  //     )}
  //   </div>
  // );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Section */}
        <header className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {userId ? 'Create Bundle for User' : 'Configurator Page'}
              </h1>
              {/* <ActionButtons /> */}
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
                bundles={bundles}
                items={processedItems}
                onItemToggle={handleItemToggle}
                onItemPriceChange={handleItemPriceChange}
                onAmountChange={handleAmountChange}
                amounts={amounts}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ConfiguratorPage;
