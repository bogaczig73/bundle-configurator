import React from 'react';
import { TableColgroup } from './TableColgroup';
import { calculateBundleTotal, formatPrice, abraColors } from '../../utils/tableUtils';

export function TableHeader({ 
  bundles, 
  amounts, 
  tableStyles, 
  flattenedItems, 
  showIndividualDiscount = false, 
  showFixace = false 
}) {
  console.log('TableHeader render with:', { bundles, amounts, flattenedItems });
  
  const bundleTotals = React.useMemo(() => {
    console.log('Calculating bundle totals with:', { bundles, amounts });
    return bundles.map(bundle => ({
      id: bundle.id,
      total: calculateBundleTotal(bundle, flattenedItems, amounts)
    }));
  }, [bundles, flattenedItems, amounts]);

  console.log('Bundle totals:', bundleTotals);

  return (
    <div className="sticky top-0 z-10">
      <table className="w-full table-fixed">
        <TableColgroup 
          bundles={bundles} 
          tableStyles={tableStyles} 
          showIndividualDiscount={showIndividualDiscount} 
          showFixace={showFixace} 
        />
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
            {showFixace && (
              <th className={tableStyles.headerCell}>
                <div className={tableStyles.centerWrapper}>
                  Fixace
                </div>
              </th>
            )}
            {showIndividualDiscount && (
              <th className={tableStyles.headerCell}>
                <div className={tableStyles.centerWrapper}>
                  Individual Discount
                </div>
              </th>
            )}
            {bundles.map((bundle, index) => {
              const bundleTotal = bundleTotals.find(bt => bt.id === bundle.id)?.total ?? 0;
              const isActive = bundle.userLimit > 0;

              console.log(`Bundle ${bundle.id}:`, { 
                total: bundleTotal,
                userLimit: bundle.userLimit,
                isActive
              });

              return (
                <React.Fragment key={`${bundle.id}-header`}>
                  <th className="w-[20px] border-none" />
                  <th className={`
                    ${tableStyles.packageHeaderCell} 
                    ${tableStyles.getBundleHeaderBorderClasses(index)}
                    ${isActive 
                      ? `bg-${abraColors[index]} ${tableStyles.activeBundle}` 
                      : tableStyles.inactiveBundle.header
                    }
                  `}>
                    <div className="flex flex-col items-center">
                      <span>{bundle.name}</span>
                      <span className={`
                        ${tableStyles.bundlePrice}
                        ${isActive 
                          ? tableStyles.activeBundle 
                          : tableStyles.inactiveBundle.price
                        }
                      `}>
                        {formatPrice(bundleTotal)}
                      </span>
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
