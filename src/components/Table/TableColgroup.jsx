import React from 'react';
import { useTableStyles } from './useTableStyles';
export function TableColgroup({ bundles }) {
  const tableStyles = useTableStyles();
    return (
    <colgroup>
      <col className={tableStyles.columnWidths.details} />
      <col className={tableStyles.columnWidths.amount} />
      <col className={tableStyles.columnWidths.fixace} />
      {bundles.map((bundle, index) => (
        <React.Fragment key={`${bundle.id}-group`}>
          <col className="w-[20px]" />
          <col className={`${tableStyles.columnWidths.bundle} ${tableStyles.getBundleBorderClasses(index)}`} />
        </React.Fragment>
      ))}
    </colgroup>
  );
}
