import React from 'react';
import { TableColgroup } from './TableColgroup';
import { TableRow } from './TableRow';


export const TableBody = ({ 
  bundles, 
  items, 
  amounts, 
  onAmountChange, 
  tableStyles, 
  readonly = false, 
  showIndividualDiscount = false, 
  showFixace = false,
  enableRowSelection = false,
  selectedRows = {},
  onRowSelect,
  currency = 'CZK',
  userRole = 'customer',
  settings ={},
}) => {
  return (
    <div className={tableStyles.tableWrapper}>
      <table className={tableStyles.table}>
        <TableColgroup 
          bundles={bundles} 
          tableStyles={tableStyles} 
          showIndividualDiscount={showIndividualDiscount} 
          showFixace={showFixace}
          enableRowSelection={enableRowSelection}
          currency={currency}
        />
        <tbody className="divide-y-0">
          {items.map((item) => (
            <TableRow 
              key={item.categoryId + "_" + item.id}
              item={item}
              bundles={bundles}
              amounts={amounts}
              onAmountChange={onAmountChange}
              tableStyles={tableStyles}
              readonly={readonly}
              showIndividualDiscount={showIndividualDiscount}
              showFixace={showFixace}
              enableRowSelection={enableRowSelection}
              selectedRows={selectedRows}
              onRowSelect={onRowSelect}
              currency={currency}
              userRole={userRole}
              settings={settings}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
