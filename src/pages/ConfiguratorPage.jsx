import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import checkmarkIconBasic  from '../images/symbols/Klad_znamenko_Basic.svg';
import checkmarkIconStandard from '../images/symbols/Klad_znamenko_Standard.svg';
import checkmarkIconPremium from '../images/symbols/Klad_znamenko_Premium.svg';
import crossIcon from '../images/symbols/Zapor_znamenko.svg';
import { BundleTable } from '../components/Table/BundleTable';

// function BundleTable({ bundles = [], items = [], onAmountChange, amounts = {} }) {
//   const flattenedItems = useMemo(() => flattenItems(items), [items]);

//   const tableStyles = {
//     headerCell: "px-2 md:px-4 py-2 text-xs font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200",
//     packageHeaderCell: "px-2 md:px-4 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider",
//     bodyCell: "px-2 md:px-4 py-2",
//     packageBodyCell: "px-2 md:px-4 py-2",
//     checkbox: "h-4 w-4 size-4 rounded border-gray-400 focus:ring-offset-0",
    
//     numberInput: "w-14 md:w-16 text-center w-full border-x-0 h-8 text-gray-900 text-sm border-gray-400 block w-full p-2",
//     inputCounterButton: "hover:bg-gray-200 border border-gray-400 p-2.5 h-8 focus:ring-gray-100 focus:ring-2 focus:outline-none",
//     counterButtonSymbols: "w-2 h-2 text-gray-400",
    
//     centerWrapper: "flex justify-center items-center h-full",
//     columnWidths: {
//       details: "w-48 min-w-[120px]",
//       amount: "w-32",
//       bundle: "w-32 px-[5px]",
//     },
    
//     // New styles
//     container: "min-w-[800px]",
//     tableWrapper: "overflow-y-auto max-h-[calc(100vh-200px)] bg-white scrollbar-hide",
//     categoryRow: "border-b-2 border-b-abraMagenta",
//     itemName: {
//       category: "font-medium text-abraMagenta text-sm break-words",
//       item: "text-gray-700 text-sm break-words"
//     },
//     itemNote: "text-xs text-gray-500 break-words",
//     freeItemText: "text-xs font-medium text-gray-400",
//     bundlePrice: "text-blue-600 font-semibold",
//     priceText: "text-xs font-medium",
//     priceNote: "text-xs text-gray-500",
//     itemRow: "hover:bg-gray-50/70 transition-colors duration-150",
//     activeBundle: "!text-white !font-bold",
//   };

//   // Add border color array
//   const abraColors = [
//     'abraYellow',
//     'abraOrange',
//     'abraMagenta',
//   ];


//   const formatPrice = (price) => {
//     return new Intl.NumberFormat('cs-CZ', {
//       style: 'currency',
//       currency: 'CZK',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };
//   const getItemSelected = (item, bundleId) => {
//     const selectionEntry = item.packages.find(p => p.packageId === bundleId);
//     return selectionEntry?.selected ?? false;
//   };
//   const getItemPrice = (item, bundleId) => {
//     if (item.individual) return 1;
//     if (!item.packages) return 0;
//     const priceEntry = item.packages.find(p => p.packageId === bundleId);
//     return priceEntry?.price ?? 0;
//   };
//   const getItemDiscount = (item, bundleId) => {
//     const priceEntry = item.packages.find(p => p.packageId === bundleId);
//     return priceEntry?.discountedAmount ?? 0;
//   };

//   // Add this function to calculate bundle totals
//   const calculateBundleTotal = (bundleId) => {
//     return flattenedItems
//       .filter(item => item.type === 'item')
//       .reduce((total, item) => {
//         const amount = amounts[item.id] || 0;
//         const discount = getItemDiscount(item, bundleId);
//         const price = getItemPrice(item, bundleId);
        
//         // Calculate charged units (amount minus discounted units, but not less than 0)
//         const chargedUnits = Math.max(0, amount - discount);
        
//         return total + (price * chargedUnits);
//       }, 0);
//   };
//   const getBundleBorderClasses = (index) => `
//     border-l-2 border-r-2
//     border-${abraColors[index % abraColors.length]}
//     relative
//     after:absolute after:content-[''] after:left-2 after:right-2 after:top-0 
//     after:border-t after:border-dotted after:border-gray-200
//   `;

//   const getBundleHeaderBorderClasses = (index) => `
//     border-l-2 border-r-2 border-t-2
//     border-${abraColors[index % abraColors.length]}
//   `;

//   // Create a shared colgroup component to ensure consistent column widths
//   const TableColgroup = () => (
//     <colgroup>
//       <col className={tableStyles.columnWidths.details} />
//       <col className={tableStyles.columnWidths.amount} />
//       {bundles.map((bundle, index) => (
//         <React.Fragment key={`${bundle.id}-group`}>
//           <col className="w-[20px]" />
//           <col className={`${tableStyles.columnWidths.bundle} ${getBundleBorderClasses(index)}`} />
//         </React.Fragment>
//       ))}
//     </colgroup>
//   );

//   // Add this helper function near the top of the BundleTable component
//   const isFreeForAllBundles = (item) => {
//     // Check if the item has prices array
//     if (!item.packages) return false;
    
//     // Check if all prices are 0 and the item is not individual
//     return item.packages.every(price => price.price === 0) && !item.individual;
//   };

//   // Update this function to check if bundle should be active based on userLimit range
//   const isBundleActive = (bundle, index) => {
//     const userAmount = amounts[1] || 0; // Check amount for item with id=1
    
//     // Get the previous bundle's limit (or 0 if it's the first bundle)
//     const previousLimit = index > 0 ? bundles[index - 1].userLimit : 0;
    
//     // Bundle is active if user amount is greater than previous limit and less than or equal to current limit
//     return userAmount > previousLimit && userAmount <= bundle.userLimit;
//   };

//   // Add this helper function near the other helper functions in BundleTable
//   const getColorClass = (index) => `text-${abraColors[index % abraColors.length]}`;

//   // Add this helper function to get the correct checkmark icon based on index
//   const getCheckmarkIcon = (index) => {
//     switch (index) {
//       case 0:
//         return checkmarkIconBasic;
//       case 1:
//         return checkmarkIconStandard;
//       case 2:
//         return checkmarkIconPremium;
//       default:
//         return checkmarkIconBasic;
//     }
//   };

//   return (
//     <div className="">
//       <div className={tableStyles.container}>
//         {/* Fixed Header */}
//         <div className="sticky top-0 z-10">
//           <table className="w-full table-fixed">
//             <TableColgroup />
//             <thead>
//               <tr>
//                 <th className={`${tableStyles.columnWidths.details} text-left ${tableStyles.headerCell}`}>
//                   Item Details
//                 </th>
//                 <th className={tableStyles.headerCell}>
//                   <div className={tableStyles.centerWrapper}>
//                     Amount
//                   </div>
//                 </th>
//                 {bundles.map((bundle, index) => (
//                   <React.Fragment key={`${bundle.id}-header`}>
//                     <th className="w-[20px] border-none" />
//                     <th className={`
//                       ${tableStyles.packageHeaderCell} 
//                       ${getBundleHeaderBorderClasses(index)}
//                       ${isBundleActive(bundle, index) ? `bg-${abraColors[index % abraColors.length]} ${tableStyles.activeBundle}` : ''}
//                     `}>
//                       <div className="flex flex-col items-center">
//                         <span>{bundle.name}</span>
//                         <span className={`
//                           ${tableStyles.bundlePrice}
//                           ${isBundleActive(bundle, index) ? tableStyles.activeBundle : ''}
//                         `}>
//                           {formatPrice(calculateBundleTotal(bundle.id))}
//                         </span>
//                       </div>
//                     </th>
//                   </React.Fragment>
//                 ))}
//               </tr>
//             </thead>
//           </table>
//         </div>

//         {/* Scrollable Body */}
//         <div className={tableStyles.tableWrapper}>
//           <table className="w-full table-fixed">
//             <TableColgroup />
//             <tbody className="divide-y-0">
//               {flattenedItems.map((item) => (
//                 <tr 
//                   key={item.uniqueId}
//                   className={`
//                     ${item.type === 'category' ? '' : tableStyles.itemRow}
//                     ${item.depth > 0 ? `pl-${item.depth * 4}` : ''}
//                   `}
//                 >
//                   {/* Item Details Cell */}
//                   <td className={`
//                     ${tableStyles.columnWidths.details} 
//                     ${tableStyles.bodyCell}
//                     ${item.type === 'category' ? tableStyles.categoryRow : ''}
//                   `}>
//                     <div className="flex flex-col">
//                       <span className={item.type === 'category' ? tableStyles.itemName.category : tableStyles.itemName.item}>
//                         {item.name}
//                       </span>
//                       {item.note && (
//                         <span className={tableStyles.itemNote}>
//                           {item.note}
//                         </span>
//                       )}
//                     </div>
//                   </td>

//                   {/* Amount Cell */}
//                   <td className={`
//                     ${tableStyles.columnWidths.amount} 
//                     ${tableStyles.bodyCell}
//                     ${item.type === 'category' ? tableStyles.categoryRow : ''}
//                   `}>
//                     <div className={tableStyles.centerWrapper}>
//                       {item.type === 'item' && (
//                         isFreeForAllBundles(item) ? (
//                           <span className={tableStyles.freeItemText}>
//                             -
//                           </span>
//                         ) : item.checkbox ? (
//                           <input
//                             type="checkbox"
//                             checked={amounts[item.id] === 1}
//                             onChange={(e) => onAmountChange(item.id, e.target.checked ? 1 : 0)}
//                             className={tableStyles.checkbox}
//                           />
//                         ) : (
//                           <div className="flex items-center">
//                             <button
//                               onClick={() => onAmountChange(item.id, Math.max(0, (amounts[item.id] || 0) - 1))}
//                               className={tableStyles.inputCounterButton + " rounded-s-md"}
//                             >
//                               <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
//                                 <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
//                               </svg>
//                             </button>
                            
//                             <input
//                               type="text"
//                               min={0}
//                               value={amounts[item.id] || 0}
//                               onChange={(e) => onAmountChange(item.id, Number(e.target.value))}
//                               className={tableStyles.numberInput}
//                             />
//                             <button
//                               onClick={() => onAmountChange(item.id, (amounts[item.id] || 0) + 1)}
//                               className={tableStyles.inputCounterButton + " rounded-e-md"}
//                             >
//                               <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
//                                 <path stroke="currentColor"  strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
//                               </svg>
//                             </button>

//                           </div>
//                         )
//                       )}
//                     </div>
//                   </td>

//                   {/* Bundle Price Cells */}
//                   {bundles.map((bundle, index) => (
//                     <React.Fragment key={`${item.id}-${bundle.id}-group`}>
//                       <td className="w-[20px]" />
//                       <td className={`${tableStyles.columnWidths.bundle} ${tableStyles.packageBodyCell} ${getBundleBorderClasses(index)}`}>
//                         {item.type === 'item' && (
//                           <div className="flex flex-col items-center">
//                           {getItemPrice(item, bundle.id) === 0 ? (
//                             <span className="">
//                               {getItemSelected(item, bundle.id) ? (
//                                 <img 
//                                   src={getCheckmarkIcon(index)} 
//                                   alt="Included" 
//                                   className={`w-12 h-12 ${getColorClass(index)}`}
//                                 />
//                               ) : (
//                                 <img 
//                                   src={crossIcon} 
//                                   alt="Not included" 
//                                   className={`w-12 h-12 ${getColorClass(index)}`}
//                                 />
//                               )}
//                             </span>
//                           ) : (
//                             <span className="text-xs font-medium">
//                               {formatPrice(getItemPrice(item, bundle.id) * (Math.max(0, amounts[item.id] - getItemDiscount(item, bundle.id)) || 0))}
//                             </span>
//                           )}
//                           <span className="text-xs text-gray-500">
//                             {getItemPrice(item, bundle.id) === 0 ? '' : 
//                               item.individual ? 'individuální paušál' : `${formatPrice(getItemPrice(item, bundle.id))} per unit` + (getItemDiscount(item, bundle.id) > 0 ? ` / první ${getItemDiscount(item, bundle.id)} v ceně` : '')}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {getItemPrice(item, bundle.id) === 0 ? '' : 
//                               `Počet zlevněných kusů: ${item.packages[0].old}`}
//                           </span>
//                         </div>
//                         )}
//                       </td>
//                     </React.Fragment>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

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
    bundleData 
  } = useConfigData(bundleId);
  const [amounts, setAmounts] = useState({});

  useEffect(() => {
    if (bundleData?.amounts) {
      setAmounts(bundleData.amounts);
    }
  }, [bundleData]);

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
                bundles={packages}
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
