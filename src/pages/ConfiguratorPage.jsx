import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { useBundleData } from '../hooks/useBundleData';

function BundleTable({ bundles = [], items = [], onAmountChange, amounts = {} }) {
  const flattenedItems = useMemo(() => flattenItems(items), [items]);

  const tableStyles = {
    headerCell: "px-2 md:px-4 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider",
    packageHeaderCell: "px-2 md:px-4 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider",
    bodyCell: "px-2 md:px-4 py-2",
    packageBodyCell: "px-2 md:px-4 py-2",
    checkbox: "h-4 w-4 size-4 rounded border-abra-magenta focus:ring-offset-0",
    
    numberInput: "w-14 md:w-16 text-center w-full border-x-0 h-8 text-gray-900 text-sm border-abra-magenta block w-full p-2",
    inputCounterButton: "hover:bg-gray-200 border border-abra-magenta p-2.5 h-8 focus:ring-gray-100 focus:ring-2 focus:outline-none",
    counterButtonSymbols: "w-2 h-2 text-abra-magenta",
    
    centerWrapper: "flex justify-center items-center h-full",
    columnWidths: {
      details: "w-48 min-w-[120px]",
      amount: "w-32",
      bundle: "w-32 px-[5px]",
    }
  };

  // Add border color array
  const borderColors = [
    'border-abra-yellow',
    'border-abra-orange',
    'border-abra-magenta',
  ];


  const formatPrice = (price) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  const getItemSelected = (item, bundleId) => {
    const selectionEntry = item.prices.find(p => p.packageId === bundleId);
    return selectionEntry?.selected ?? false;
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
  const getBundleBorderClasses = (index) => `
    border-l-2 border-r-2
    ${borderColors[index % borderColors.length]}
    relative
    after:absolute after:content-[''] after:left-2 after:right-2 after:top-0 
    after:border-t after:border-dotted after:border-gray-200
  `;

  const getBundleHeaderBorderClasses = (index) => `
    border-l-2 border-r-2 border-t-2
    ${borderColors[index % borderColors.length]}
  `;

  // Create a shared colgroup component to ensure consistent column widths
  const TableColgroup = () => (
    <colgroup>
      <col className={tableStyles.columnWidths.details} />
      <col className={tableStyles.columnWidths.amount} />
      {bundles.map((bundle, index) => (
        <React.Fragment key={`${bundle.id}-group`}>
          <col className="w-[20px]" />
          <col className={`${tableStyles.columnWidths.bundle} ${getBundleBorderClasses(index)}`} />
        </React.Fragment>
      ))}
    </colgroup>
  );

  // Add this helper function near the top of the BundleTable component
  const isFreeForAllBundles = (item) => {
    // Check if the item has prices array
    if (!item.prices) return false;
    
    // Check if all prices are 0 and the item is not individual
    return item.prices.every(price => price.price === 0) && !item.individual;
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm">
      <div className="min-w-[800px]">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 border-b border-gray-200">
          <table className="w-full table-fixed">
            <TableColgroup />
            <thead>
              <tr>
                <th className={`${tableStyles.columnWidths.details} text-left ${tableStyles.headerCell}`}>
                  Item Details
                </th>
                <th className={tableStyles.headerCell}>
                  <div className={tableStyles.centerWrapper}>
                    Amount
                  </div>
                </th>
                {bundles.map((bundle, index) => (
                  <React.Fragment key={`${bundle.id}-header`}>
                    <th className="w-[20px]" />
                    <th className={`${tableStyles.packageHeaderCell} ${getBundleHeaderBorderClasses(index)}`}>
                      <div className="flex flex-col items-center">
                        <span>{bundle.name}</span>
                        <span className="text-blue-600 font-semibold">
                          {formatPrice(calculateBundleTotal(bundle.id))}
                        </span>
                      </div>
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] bg-white">
          <table className="w-full table-fixed">
            <TableColgroup />
            <tbody className="divide-y-0">
              {flattenedItems.map((item) => (
                <tr 
                  key={item.uniqueId}
                  className={`
                    ${item.type === 'category' ? '' : 'hover:bg-gray-50/70 transition-colors duration-150'}
                    ${item.depth > 0 ? `pl-${item.depth * 4}` : ''}
                  `}
                >
                  {/* Item Details Cell */}
                  <td className={`
                    ${tableStyles.columnWidths.details} 
                    ${tableStyles.bodyCell}
                    ${item.type === 'category' ? 'border-b-2 border-b-abra-magenta' : ''}
                  `}>
                    <div className="flex flex-col">
                      <span className={`${item.type === 'category' ? 'font-medium text-abra-magenta' : 'text-gray-700'} text-sm break-words`}>
                        {item.name}
                      </span>
                      {item.note && (
                        <span className="text-xs text-gray-500 break-words">
                          {item.note}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Amount Cell */}
                  <td className={`
                    ${tableStyles.columnWidths.amount} 
                    ${tableStyles.bodyCell}
                    ${item.type === 'category' ? 'border-b-2 border-b-abra-magenta' : ''}
                  `}>
                    <div className={tableStyles.centerWrapper}>
                      {item.type === 'item' && (
                        isFreeForAllBundles(item) ? (
                          <span className="text-xs font-medium">
                            -
                          </span>
                        ) : item.checkbox ? (
                          <input
                            type="checkbox"
                            checked={amounts[item.id] === 1}
                            onChange={(e) => onAmountChange(item.id, e.target.checked ? 1 : 0)}
                            className={tableStyles.checkbox}
                          />
                        ) : (
                          <div className="flex items-center">
                            <button
                              onClick={() => onAmountChange(item.id, Math.max(0, (amounts[item.id] || 0) - 1))}
                              className={tableStyles.inputCounterButton + " rounded-s-md"}
                            >
                              <svg class={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                              </svg>
                            </button>
                            
                            <input
                              type="text"
                              min={0}
                              value={amounts[item.id] || 0}
                              onChange={(e) => onAmountChange(item.id, Number(e.target.value))}
                              className={tableStyles.numberInput}
                            />
                            <button
                              onClick={() => onAmountChange(item.id, (amounts[item.id] || 0) + 1)}
                              className={tableStyles.inputCounterButton + " rounded-e-md"}
                            >
                              <svg class={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                              </svg>
                            </button>

                          </div>
                        )
                      )}
                    </div>
                  </td>

                  {/* Bundle Price Cells */}
                  {bundles.map((bundle, index) => (
                    <React.Fragment key={`${item.id}-${bundle.id}-group`}>
                      <td className="w-[20px]" />
                      <td className={`${tableStyles.columnWidths.bundle} ${tableStyles.packageBodyCell} ${getBundleBorderClasses(index)}`}>
                        {item.type === 'item' && (
                          <div className="flex flex-col items-center">
                            {getItemPrice(item, bundle.id) === 0 ? (
                              <span className="text-xs font-medium">
                                {getItemSelected(item, bundle.id) ? '✅' : '❌'}
                              </span>
                            ) : (
                              <span className="text-xs font-medium">
                                {formatPrice(getItemPrice(item, bundle.id, amounts[item.id]) * (amounts[item.id] || 0))}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {getItemPrice(item, bundle.id) === 0 ? '' : 
                                item.individual ? 'individuální paušál' : `${formatPrice(getItemPrice(item, bundle.id))} per unit`}
                            </span>
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
