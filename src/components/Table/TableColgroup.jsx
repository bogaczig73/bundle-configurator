import React from 'react';
import { useTableStyles } from './useTableStyles';
export function TableColgroup({ 
  bundles, 
  tableStyles, 
  showIndividualDiscount = false,
  showFixace = false,
  enableRowSelection = false
}) {
  return (
    <colgroup>
      {enableRowSelection && (
        <col className="w-10" data-selector-column />
      )}
      <col className={tableStyles.columnWidths.details} />
      <col className={tableStyles.columnWidths.amount} />
      {showFixace && (
        <col className={tableStyles.columnWidths.fixace} />
      )}
      {showIndividualDiscount && (
        <col className={tableStyles.columnWidths.fixace} />
      )}
      {bundles.map((bundle, index) => (
        <React.Fragment key={`${bundle.id}-group`}>
          <col className="!w-[20px] min-w-[20px]" />
          <col className={`${tableStyles.columnWidths.bundle} ${tableStyles.getBundleBorderClasses(index)}`} />
        </React.Fragment>
      ))}
    </colgroup>
  );
}
