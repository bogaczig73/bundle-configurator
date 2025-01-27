import React from 'react';
import { TableColgroup } from './TableColgroup';
import { TableRow } from './TableRow';
import { useTable } from './TableContext';

export const TableBody = ({ tableStyles }) => {
  const { 
    bundles,
    items,
    amounts,
    onAmountChange,
    readonly,
    showIndividualDiscount,
    showFixace,
    enableRowSelection,
    selectedRows,
    onRowSelect,
    currency,
    userRole,
    settings
  } = useTable();

  return (
    <div className={tableStyles.tableWrapper}>
      <table className={tableStyles.table}>
        <TableColgroup tableStyles={tableStyles} />
        <tbody className="divide-y-0">
          {items.map((item) => (
            <TableRow 
              key={item.categoryId + "_" + item.id}
              item={item}
              tableStyles={tableStyles}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
