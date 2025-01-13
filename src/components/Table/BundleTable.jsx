import React, { useMemo, forwardRef } from 'react';
import { MemoizedTableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { processItems } from '../../utils/tableUtils';
import { useTableStyles } from './useTableStyles';

export const BundleTable = forwardRef(({ 
  bundles = [], 
  items = [], 
  onAmountChange, 
  amounts = {}, 
  readonly = false, 
  exporting = false, 
  showIndividualDiscount = false, 
  showFixace = false,
  currency = 'CZK',
  enableRowSelection = false,
  selectedRows = {},
  onRowSelect,
  globalDiscount = 0
}, ref) => {
  const tableStyles = useTableStyles(exporting);
  const flattenedItems = useMemo(() => processItems(items), [items]);

  return (
    <div id="bundle-table-container" ref={ref} className={tableStyles.container}>
      <MemoizedTableHeader 
        bundles={bundles}
        amounts={{...amounts, globalDiscount}}
        tableStyles={tableStyles}
        flattenedItems={flattenedItems}
        showIndividualDiscount={showIndividualDiscount}
        showFixace={showFixace}
        enableRowSelection={enableRowSelection}
        currency={currency}
      />
      <TableBody 
        bundles={bundles}
        items={flattenedItems}
        amounts={{...amounts, globalDiscount}}
        onAmountChange={onAmountChange}
        tableStyles={tableStyles}
        readonly={readonly}
        showIndividualDiscount={showIndividualDiscount}
        showFixace={showFixace}
        enableRowSelection={enableRowSelection}
        selectedRows={selectedRows}
        onRowSelect={onRowSelect}
        currency={currency}
      />
    </div>
  );
});
