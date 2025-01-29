import React, { useMemo, useState } from 'react';
import { TableColgroup } from './TableColgroup';
import { calculateBundleTotal } from '../../utils/bundleUtils';
import { formatPrice } from '../../utils/priceUtils';
import { abraColors } from './useTableStyles';
import { useTable } from './TableContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

function TableHeader({ tableStyles }) {
  const { 
    bundles, 
    items: flattenedItems, 
    amounts, 
    showIndividualDiscount, 
    showFixace,
    enableRowSelection,
    currency,
    settings,
    isBundleActive,
    isBundleInactive
  } = useTable();

  const [activeTooltip, setActiveTooltip] = useState(null);

  const bundleTotals = useMemo(() => {
    return bundles.map(bundle => ({
      id: bundle.id,
      total: calculateBundleTotal(bundle, flattenedItems, amounts)
    }));
  }, [
    bundles, 
    flattenedItems, 
    amounts.amounts, 
    amounts.fixace, 
    amounts.discount, 
    amounts.globalDiscount,
    JSON.stringify(amounts)  // This ensures we catch all nested changes
  ]);

  return (
    <div className="sticky top-0 z-10 bg-white">
      <table className="w-full table-fixed">
        <TableColgroup tableStyles={tableStyles} />
        <thead>
          <tr>
            {enableRowSelection && (
              <th className={`${tableStyles.headerCell} w-10`} data-selector-column>
                <div className={tableStyles.centerWrapper}>
                  Výběr
                </div>
              </th>
            )}
            <th className={`${tableStyles.columnWidths.details} text-left ${tableStyles.headerCell}`}>
              Název položky
            </th>
            <th className={tableStyles.headerCell}>
              <div className={tableStyles.centerWrapper}>
                Množství
              </div>
            </th>
            {showFixace && (
              <th className={tableStyles.headerCell}>
                <div className={tableStyles.centerWrapper}>
                  <div className="flex flex-col items-center">
                    <span>Fixace</span>
                    {settings.showCopyToFixationButton && (
                      <span className="text-[10px] text-abraMagenta font-normal mt-0.5">
                        (Automatické kopírování)
                      </span>
                    )}
                  </div>
                </div>
              </th>
            )}
            {showIndividualDiscount && (
              <th className={tableStyles.headerCell}>
                <div className={tableStyles.centerWrapper}>
                  Individuální slevy
                </div>
              </th>
            )}
            {bundles.map((bundle, index) => {
              const bundleTotal = bundleTotals.find(bt => bt.id === bundle.id)?.total ?? 0;
              const isActive = isBundleActive(bundle);
              const isInactive = isBundleInactive(bundle);

              return (
                <React.Fragment key={`${bundle.id}-header`}>
                  <th className="!w-[20px] min-w-[20px] border-none">
                  {bundle.nonSelectedItems && bundle.nonSelectedItems.length > 0 && (
                    <div className={`info-tooltip absolute mt-2 font-normal ${activeTooltip === bundle.id ? 'block' : 'hidden'}`}>
                      <div className="absolute mt-2 w-64 bg-white text-gray-900 text-xs rounded-lg p-2.5 shadow-xl z-50 border-2 border-gray-300">
                        {/* Arrow */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 
                          border-l-[8px] border-l-transparent
                          border-r-[8px] border-r-transparent
                          border-b-[8px] border-b-abraMagenta">
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-abraMagenta border-b border-abraMagenta/20 pb-1.5 text-xs">
                            Nedostupné položky v balíčku
                          </div>
                          <ul className="space-y-1">
                            {bundle.nonSelectedItems.map((item, i) => (
                              <li key={i} className="flex items-center gap-1.5 text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0 text-abraOrange" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs">
                                  {item.name}
                                  <span className="text-abraOrange ml-1">
                                    ({item.amount}x)
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="text-[10px] text-gray-600 border-t border-abraMagenta/20 pt-1.5 mt-1.5 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-abraYellow" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Pro tyto položky vyberte vyšší balíček
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  </th>
                  <th 
                    className={`
                      group
                      ${tableStyles.packageHeaderCell} 
                      ${tableStyles.getBundleHeaderBorderClasses(index)}
                      ${isActive ? `bg-${abraColors[index]} ${tableStyles.activeBundle}` : ''}
                      ${isInactive ? tableStyles.inactiveBundle.header : ''}
                    `}
                  >
                    <div className={tableStyles.centerWrapper}>
                      <div className="flex flex-col items-center relative">
                        <div className="flex items-center gap-2">
                          {bundle.name}
                          {bundle.nonSelectedItems && bundle.nonSelectedItems.length > 0 && index < bundles.length - 1 && (
                            <div 
                              onMouseEnter={() => setActiveTooltip(bundle.id)}
                              onMouseLeave={() => setActiveTooltip(null)}
                              className="relative"
                            >
                              <FontAwesomeIcon 
                                icon={faCircleInfo} 
                                className={`h-5 w-5 transition-colors duration-150 ${
                                  isInactive ? 'text-gray-600 hover:text-gray-500' : 'text-white hover:text-white/80'
                                }`}
                              />
                            </div>
                          )}
                        </div>
                        <span className={`
                          ${tableStyles.bundlePrice}
                          ${isActive ? tableStyles.activeBundle : ''}
                          ${isInactive ? tableStyles.inactiveBundle.price : ''}
                        `}>
                          {formatPrice(bundleTotal, currency)}
                        </span>
                      </div>
                    </div>
                  </th>
                </React.Fragment>
              );
            })}
          </tr>
        </thead>
      </table>
    </div>
  );
}

export const MemoizedTableHeader = React.memo(TableHeader);
