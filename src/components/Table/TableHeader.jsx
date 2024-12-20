import React from 'react';
import { TableColgroup } from './TableColgroup';
import { isBundleActive, formatPrice, calculateBundleTotal } from '../../utils/tableUtils';
import { abraColors } from './useTableStyles';

export function TableHeader({ bundles, amounts, tableStyles, flattenedItems }) {
  return (
    <div className="sticky top-0 z-10">
      <table className="w-full table-fixed">
        <TableColgroup bundles={bundles} tableStyles={tableStyles} />
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
            <th className={tableStyles.headerCell}>
              <div className={tableStyles.centerWrapper}>
                Fixace
              </div>
            </th>
            {bundles.map((bundle, index) => (
              <React.Fragment key={`${bundle.id}-header`}>
                <th className="w-[20px] border-none" />
                <th className={`
                  ${tableStyles.packageHeaderCell} 
                  ${tableStyles.getBundleHeaderBorderClasses(index)}
                  ${isBundleActive(bundle, index, amounts, bundles) ? `bg-${abraColors[index]} ${tableStyles.activeBundle}` : ''}
                `}>
                  <div className="flex flex-col items-center">
                    <span>{bundle.name}</span>
                    <span className={`
                      ${tableStyles.bundlePrice}
                      ${isBundleActive(bundle, index, amounts, bundles) ? tableStyles.activeBundle : ''}
                    `}>
                      {formatPrice(calculateBundleTotal(bundle.id, flattenedItems, amounts))}
                    </span>
                  </div>
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  );
}
