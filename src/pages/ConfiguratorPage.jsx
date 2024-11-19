import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { useBundleData } from '../hooks/useBundleData';

function BundleTable({ bundles = [], items = [], onItemToggle, onItemPriceChange, onAmountChange, amounts = {} }) {

  if (!bundles?.length || !items?.length) {
    return (
      <div className="p-4 text-gray-500">
        No data available
      </div>
    );
  }

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
    if (item.individual) return 1;
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
    <div className="border border-gray-200 rounded-lg shadow-sm">
      <div className="min-w-[800px]">
        {/* Fixed Header */}
        <div className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-48 min-w-[120px]" />
              <col className="w-16" />
              {bundles.map(() => (
                <col className="w-32" />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Položka
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Počet
                </th>
                {bundles.map(bundle => (
                  <th key={bundle.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
          </table>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] bg-white">
          <table className="w-full table-fixed">
            <colgroup>
              <col className="w-48 min-w-[120px]" />
              <col className="w-16" />
              {bundles.map(() => (
                <col className="w-32" />
              ))}
            </colgroup>
            <tbody className="divide-y divide-gray-200">
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
                      <>
                        {item.checkbox ? (
                          <input
                            type="checkbox"
                            checked={amounts[item.id] === 1}
                            onChange={(e) => onAmountChange(item.id, e.target.checked ? 1 : 0)}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        ) : (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => onAmountChange(item.id, Math.max(0, (amounts[item.id] || 0) - 1))}
                              className="px-1.5 py-0.5 text-xs border border-gray-300 rounded-sm hover:bg-gray-100"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={0}
                              value={amounts[item.id] || 0}
                              onChange={(e) => onAmountChange(item.id, item.individual ? Number(e.target.value) : e.target.value)}
                              className="block w-12 rounded-sm border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs py-1"
                            />
                            <button
                              onClick={() => onAmountChange(item.id, (amounts[item.id] || 0) + 1)}
                              className="px-1.5 py-0.5 text-xs border border-gray-300 rounded-sm hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                  
                  {item.type === 'category' && bundles.map(bundle => (
                    <td key={`${item.uniqueId}-${bundle.id}`} className="px-4 py-2" />
                  ))}
                  
                  {item.type === 'item' && bundles.map(bundle => (
                    <td key={`${item.uniqueId}-${bundle.id}`} className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="block text-xs py-1 text-gray-700 font-medium">
                          {formatPrice(item.individual ? (amounts[item.id] || 0) : getItemPrice(item, bundle.id) * (amounts[item.id] || 0))}
                        </span>
                        <span className="block text-xs py-1 text-gray-500">
                          {item.individual ? formatPrice(1) : formatPrice(getItemPrice(item, bundle.id))} {!item.individual && 'za jednotku'}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

function ConfiguratorPage() {
  const { bundleId } = useParams();
  const { 
    loading, 
    error, 
    processedItems, 
    packages, 
    items, 
    bundleData 
  } = useConfigData(bundleId);
  const { bundlesState, setBundlesState } = useBundleData();
  const [amounts, setAmounts] = useState({});

  useEffect(() => {
    if (bundleData?.amounts) {
      setAmounts(bundleData.amounts);
    } else if (packages.length) {
      // Original logic for loading default data
      const newBundlesState = packages.map(pkg => ({
        ...pkg,
        items: items.reduce((acc, item) => ({
          ...acc,
          [item.id]: {
            selected: false,
            price: item.prices?.find(p => p.packageId === pkg.id)?.price || 0
          }
        }), {})
      }));
      setBundlesState(newBundlesState);
    }
  }, [bundleData, packages, items, setBundlesState]);

  const handleItemToggle = (bundleId, itemId) => {
    // Implementation similar to BundleSettingsPage
  };
  
  const handleItemPriceChange = (bundleId, itemId, price) => {
    // Implementation similar to BundleSettingsPage
  };

  const handleAmountChange = (itemId, amount) => {
    setAmounts(prev => ({ ...prev, [itemId]: Number(amount) }));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {bundleId ? `Bundle ${bundleId}` : 'New Bundle Configuration'}
              </h1>
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
          ) : error ? (
            <div className="p-6 text-red-600">
              {error}
            </div>
          ) : (
            <div className="p-6">
              <BundleTable
                bundles={bundlesState || []}
                items={processedItems || []}
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
