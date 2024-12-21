import React, { useMemo, forwardRef } from 'react';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { flattenItems } from '../../utils/tableUtils';
import { useTableStyles } from './useTableStyles';


export const BundleTable = forwardRef(({ bundles = [], items = [], onAmountChange, amounts = {}, readonly = false, exporting = false, showIndividualDiscount = false, showFixace = false }, ref) => {
  const tableStyles = useTableStyles(exporting);
  const flattenedItems = useMemo(() => {
    console.log('BundleTable items:', items);
    const flattened = flattenItems(items);
    console.log('BundleTable flattenedItems:', flattened);
    return flattened;
  }, [items]);

  console.log('BundleTable render:', {
    bundles,
    amounts,
    flattenedItemsCount: flattenedItems?.length
  });

  const isBundleActive = (bundle) => {
    return bundle.userLimit > 0;
  };

  const calculateBundleTotal = (bundleId) => {
    const bundle = bundles.find(b => b.id === bundleId);
    if (!isBundleActive(bundle)) {
      return 0;
    }
    // ... rest of the calculateBundleTotal function ...
  };

  return (
      <div id="bundle-table-container" ref={ref} className={tableStyles.container}>
        <TableHeader 
          bundles={bundles}
          amounts={amounts}
          tableStyles={tableStyles}
          flattenedItems={flattenedItems}
          showIndividualDiscount={showIndividualDiscount}
          showFixace={showFixace}
        />
        <TableBody 
          bundles={bundles}
          items={flattenedItems}
          amounts={amounts}
          onAmountChange={onAmountChange}
          tableStyles={tableStyles}
          readonly={readonly}
          showIndividualDiscount={showIndividualDiscount}
          showFixace={showFixace}
        />
      </div>
  );
});
