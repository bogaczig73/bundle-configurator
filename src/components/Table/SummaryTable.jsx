import React from 'react';
import { roundPrice, formatPrice } from '../../utils/priceUtils';
import { Item } from '../../types/Item';
import { abraColors, getColorHex, useTableStyles } from './useTableStyles';
import { TableColgroup } from './TableColgroup';
import { isBundleActive, isBundleDisabled } from '../../utils/bundleUtils';

const processItems = (items) => {
  const result = [];
  items.forEach(item => {
    if (item.type === 'category' && item.children) {
      result.push(...processItems(item.children));
    } else if (item.type === 'item') {
      result.push(item);
    }
  });
  return result;
};

const calculateBundleTotals = (flatItems, amounts = {}, bundle) => {
  let totals = {
    withoutDiscount: 0,
    totalDiscount: 0,
    final: 0
  };

  if (!flatItems?.length || !bundle) return totals;

  flatItems.forEach(item => {
    const itemInstance = item instanceof Item ? item : new Item(item);
    const basePrice = itemInstance.getPrice(bundle.id);
    const fixedAmount = amounts.fixace?.[itemInstance.id] || 0;
    const totalAmount = amounts.amounts?.[itemInstance.id] || 0;
    
    if (basePrice === 0 || totalAmount === 0) return;

    // Set the amounts and discounts on the item instance
    itemInstance.setAmounts(totalAmount, fixedAmount);
    
    // Set discounts - handle global discount for fixed items
    const fixedItemsKey = `${itemInstance.id}_fixed_items`;
    const overFixationKey = `${itemInstance.id}_over_fixation_items`;
    
    const fixedDiscount = amounts.individualDiscounts?.[fixedItemsKey] ? 
      amounts.discount?.[fixedItemsKey] : 
      amounts.globalDiscount ?? 0;
      
    itemInstance.setDiscounts(
      fixedDiscount, // fixace discount (use global if no individual)
      amounts.discount?.[overFixationKey] ?? 0, // over fixation discount
      amounts.discount?.[itemInstance.id] ?? itemInstance.discount ?? 0 // individual item discount
    );

    // Calculate totals
    const priceBeforeDiscount = basePrice * totalAmount;
    const finalPrice = itemInstance.calculateTotalPrice(bundle.id);
    const itemDiscount = itemInstance.calculateTotalDiscount(bundle.id);

    totals.withoutDiscount += priceBeforeDiscount;
    totals.totalDiscount += itemDiscount;
    totals.final += finalPrice;
  });

  return totals;
};

export const SummaryTable = ({ items = [], amounts = {}, currency = 'CZK', bundles = [], exporting = false, globalDiscount = 0, showIndividualDiscount = false, showFixace = false }) => {
  const styles = useTableStyles(exporting);
  const flatItems = processItems(items);

  // Map all bundles, not just ones with non-zero totals
  const bundleTotals = bundles.map(bundle => ({
    bundle,
    totals: calculateBundleTotals(flatItems, { ...amounts, globalDiscount }, bundle)
  }));
  

  return (
    <div className="mt-8">
      <table className={styles.table}>
        <TableColgroup 
          bundles={bundles} 
          tableStyles={styles}
          showIndividualDiscount={showIndividualDiscount}
          showFixace={showFixace}
          enableRowSelection={false}
        />
        <thead>
          <tr>
            <th className={`${styles.headerCell} text-left py-4`}>
              Souhrn
            </th>
            {showFixace && <th className={`${styles.headerCell}`}>
            </th>}
            {showIndividualDiscount && <th className={`${styles.headerCell}`}>
            </th>}
            <th className={`${styles.headerCell}`}></th> {/* Empty spacer cell */}

            {bundleTotals.map(({ bundle }, index) => {
              const isActive = isBundleActive(bundle, index, amounts.amounts, bundles);
              const isDisabled = isBundleDisabled(bundle, index, amounts.amounts);
              return (
                <React.Fragment key={bundle.id}>
                  <th className="!w-[20px] min-w-[20px]" /> {/* Separator header */}
                  <th 
                    className={`
                      ${styles.packageHeaderCell} 
                      ${styles.getBundleHeaderBorderClasses(index)}
                      ${isActive ? `bg-${abraColors[index]} ${styles.activeBundle}` : ''}
                      ${isDisabled ? styles.inactiveBundle.header : ''}
                    `}
                  >
                    <div className={styles.centerWrapper}>
                      {bundle.name}
                    </div>
                  </th>
                </React.Fragment>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {/* Price without discounts */}
          <tr>
            <td className={`${styles.bodyCell} ${styles.itemName.item} font-medium py-4`}>
              Plná cena bez slevy
            </td>
            {showFixace && <td />}
            {showIndividualDiscount && <td />}
            <td /> {/* Empty spacer cell */}

            {bundleTotals.map(({ bundle, totals }, index) => {
              const isActive = isBundleActive(bundle, index, amounts.amounts, bundles);
              const isDisabled = isBundleDisabled(bundle, index, amounts.amounts);
              return (
                <React.Fragment key={bundle.id}>
                  <td className="!w-[20px] min-w-[20px]" /> {/* Separator cell */}
                  <td 
                    className={`
                      ${styles.packageBodyCell} 
                      text-right 
                      ${styles.getBundleBorderClasses(index)} 
                      ${isDisabled ? styles.inactiveBundle.cell : ''}
                      py-4
                    `}
                  >
                    <div className={styles.centerWrapper}>
                      <div className="flex flex-col items-center">
                        <div className="text-sm text-gray-700">
                          {formatPrice(totals.withoutDiscount, currency)}
                        </div>
                      </div>
                    </div>
                  </td>
                </React.Fragment>
              );
            })}
          </tr>

          {/* Total discounted amount */}
          <tr>
            <td className={`${styles.bodyCell} ${styles.itemName.item} font-medium py-4`}>
              Výše slevy
            </td>
            {showFixace && <td />}
            {showIndividualDiscount && <td />}
            <td /> {/* Empty spacer cell */}

            {bundleTotals.map(({ bundle, totals }, index) => {
              const isActive = isBundleActive(bundle, index, amounts.amounts, bundles);
              const isDisabled = isBundleDisabled(bundle, index, amounts.amounts);
              return (
                <React.Fragment key={bundle.id}>
                  <td className="!w-[20px] min-w-[20px]" /> {/* Separator cell */}
                  <td 
                    className={`
                      ${styles.packageBodyCell} 
                      text-right 
                      ${styles.getBundleBorderClasses(index)} 
                      ${isDisabled ? styles.inactiveBundle.cell : ''}
                      py-4
                    `}
                  >
                    <div className={styles.centerWrapper}>
                      <div className="flex flex-col items-center">
                        <div className="text-sm">
                          {totals.totalDiscount > 0 ? `-${formatPrice(totals.totalDiscount, currency)}` : formatPrice(0, currency)}
                        </div>
                      </div>
                    </div>
                  </td>
                </React.Fragment>
              );
            })}
          </tr>

          {/* Final price after all discounts */}
          <tr>
            <td className={`${styles.bodyCell} ${styles.itemName.item} py-4`}>
            Celková cena po slevě za měsíc bez DPH
            </td>
            {showFixace && <td />}
            {showIndividualDiscount && <td />}
            <td /> {/* Empty spacer cell */}

            {bundleTotals.map(({ bundle, totals }, index) => {
              const isActive = isBundleActive(bundle, index, amounts.amounts, bundles);
              const isDisabled = isBundleDisabled(bundle, index, amounts.amounts);
              return (
                <React.Fragment key={bundle.id}>
                  <td className="!w-[20px] min-w-[20px]" /> {/* Separator cell */}
                  <td 
                    className={`
                      ${styles.packageBodyCell} 
                      text-right 
                      ${styles.getBundleBorderClasses(index)} 
                      ${isDisabled ? styles.inactiveBundle.cell : ''}
                      ${isActive ? `bg-${abraColors[index]} ${styles.activeBundle}` : ''}
                      py-4
                    `}
                  >
                    <div className={styles.centerWrapper}>
                      <div className="flex flex-col items-center">
                        <div className={`text-sm ${isActive ? `` : 'font-medium'} ${isDisabled ? styles.inactiveBundle.price : ''} `}>
                          {formatPrice(totals.final, currency)}
                        </div>
                      </div>
                    </div>
                  </td>
                </React.Fragment>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};