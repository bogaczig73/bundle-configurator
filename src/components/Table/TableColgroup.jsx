import React from 'react';
import { getBundleBorderClasses } from './useTableStyles';

export function TableColgroup({ bundles, tableStyles }) {
  return (
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
}
