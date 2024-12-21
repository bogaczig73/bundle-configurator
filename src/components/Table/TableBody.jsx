import React from 'react';
import { TableColgroup } from './TableColgroup';
import { TableRow } from './TableRow';


export function TableBody({ bundles, items, amounts, onAmountChange, tableStyles, readonly = false, showIndividualDiscount = false, showFixace = false }) {
  return (
    <div className={tableStyles.tableWrapper}>
      <table className="w-full table-fixed">
        <TableColgroup bundles={bundles} tableStyles={tableStyles} showIndividualDiscount={showIndividualDiscount} showFixace={showFixace} />
        <tbody className="divide-y-0">
          {items.map((item) => (
            <TableRow 
              key={item.uniqueId}
              item={item}
              bundles={bundles}
              amounts={amounts}
              onAmountChange={onAmountChange}
              tableStyles={tableStyles}
              readonly={readonly}
              showIndividualDiscount={showIndividualDiscount}
              showFixace={showFixace}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
