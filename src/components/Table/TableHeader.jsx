import React, { useMemo } from 'react';
import { TableColgroup } from './TableColgroup';
import { formatPrice } from '../../utils/priceUtils';
import { calculateBundleTotal, isBundleActive, isBundleDisabled } from '../../utils/bundleUtils';
import { abraColors as ABRA_COLORS} from './useTableStyles';

function TableHeader({ 
  bundles, 
  amounts, 
  tableStyles, 
  flattenedItems, 
  showIndividualDiscount = false, 
  showFixace = false,
  enableRowSelection = false,
  currency = 'CZK'
}) {
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
        <TableColgroup 
          bundles={bundles} 
          tableStyles={tableStyles} 
          showIndividualDiscount={showIndividualDiscount} 
          showFixace={showFixace}
          enableRowSelection={enableRowSelection}
        />
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
                  Fixace
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
              const isActive = isBundleActive(bundle, index, amounts.amounts, bundles);
              const isDisabled = isBundleDisabled(bundle, index, amounts.amounts);
              return (
                <React.Fragment key={`${bundle.id}-header`}>
                  <th className="!w-[20px] min-w-[20px] border-none" />
                  <th className={`
                    ${tableStyles.packageHeaderCell} 
                    ${tableStyles.getBundleHeaderBorderClasses(index)}
                    ${isActive ? `bg-${ABRA_COLORS[index]} ${tableStyles.activeBundle}` : ''}
                    ${isDisabled ? tableStyles.inactiveBundle.header : ''}
                  `}>
                    <div className="flex flex-col items-center">
                      <span>{bundle.name}</span>
                      <span className={`
                        ${tableStyles.bundlePrice}
                        ${isActive ? tableStyles.activeBundle : ''}
                        ${isDisabled ? tableStyles.inactiveBundle.price : ''}
                      `}>
                        {formatPrice(bundleTotal, currency)}
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

export const MemoizedTableHeader = React.memo(TableHeader);
