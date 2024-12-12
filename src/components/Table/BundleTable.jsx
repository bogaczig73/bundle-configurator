import React, { useMemo } from 'react';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { flattenItems } from '../../utils/tableUtils';
import { useTableStyles } from './useTableStyles';

export function BundleTable({ bundles = [], items = [], onAmountChange, amounts = {} }) {
  const tableStyles = useTableStyles();
  const flattenedItems = useMemo(() => flattenItems(items), [items]);

  return (
    <div className="">
      <div className={tableStyles.container}>
        <TableHeader 
          bundles={bundles}
          amounts={amounts}
          tableStyles={tableStyles}
          flattenedItems={flattenedItems}
        />
        <TableBody 
          bundles={bundles}
          items={flattenedItems}
          amounts={amounts}
          onAmountChange={onAmountChange}
          tableStyles={tableStyles}
        />
      </div>
    </div>
  );
}
