import React, { useMemo, forwardRef } from 'react';
import { MemoizedTableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { processItems } from '../../utils/tableUtils';
import { useTableStyles } from './useTableStyles';
import { TableProvider } from './TableContext';

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
  globalDiscount = 0,
  userRole = 'customer',
  settings = {},
}, ref) => {
  const tableStyles = useTableStyles(exporting);
  const flattenedItems = useMemo(() => processItems(items), [items]);
  return (
    <TableProvider
      bundles={bundles}
      items={flattenedItems}
      processedItems={items}
      amounts={{...amounts, globalDiscount}}
      onAmountChange={onAmountChange}
      readonly={readonly}
      showIndividualDiscount={showIndividualDiscount}
      showFixace={showFixace}
      enableRowSelection={enableRowSelection}
      selectedRows={selectedRows}
      onRowSelect={onRowSelect}
      currency={currency}
      userRole={userRole}
      settings={settings}
    >
      <div id="bundle-table-container" ref={ref} className={tableStyles.container}>
        <MemoizedTableHeader tableStyles={tableStyles} />
        <TableBody tableStyles={tableStyles} />
      </div>
    </TableProvider>
  );
});
