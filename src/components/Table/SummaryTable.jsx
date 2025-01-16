import React from 'react';
import { roundPrice, formatPrice } from '../../utils/priceUtils';
import { Item } from '../../types/Item';
import { abraColors, getColorHex, useTableStyles } from './useTableStyles';

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

const calculateBundleTotals = (flatItems, amounts, bundle) => {
  let totals = {
    withoutDiscount: 0,
    withGlobalDiscount: 0,
    withItemDiscount: 0,
    final: 0
  };

  flatItems.forEach(item => {
    const itemInstance = item instanceof Item ? item : new Item(item);
    const basePrice = itemInstance.getPrice(bundle.id);
    const fixedAmount = amounts.fixace[itemInstance.id] || 0;
    const totalAmount = amounts.amounts[itemInstance.id] || 0;
    
    if (basePrice === 0 || totalAmount === 0) return;

    // Calculate base price without any discounts
    const priceBeforeDiscount = roundPrice(basePrice * totalAmount);
    totals.withoutDiscount += priceBeforeDiscount;

    // Calculate price after global discount
    const globalDiscount = amounts.globalDiscount ?? 0;
    const priceAfterGlobalDiscount = roundPrice(priceBeforeDiscount * (1 - globalDiscount / 100));
    totals.withGlobalDiscount += priceAfterGlobalDiscount;

    // Calculate price after item discounts
    let priceAfterItemDiscount = priceAfterGlobalDiscount;
    if (fixedAmount > 0) {
      const fixedPrice = roundPrice(basePrice * fixedAmount);
      const remainingAmount = totalAmount - fixedAmount;
      
      if (remainingAmount > 0) {
        const overFixedDiscount = amounts.discount?.[`${itemInstance.id}_over_fixation_items`] ?? 0;
        priceAfterItemDiscount = roundPrice(
          fixedPrice * (1 - globalDiscount / 100) +
          (basePrice * remainingAmount) * (1 - overFixedDiscount / 100)
        );
      }
    } else {
      const itemDiscount = amounts.discount?.[itemInstance.id] ?? itemInstance.discount ?? 0;
      priceAfterItemDiscount = roundPrice(priceAfterGlobalDiscount * (1 - itemDiscount / 100));
    }
    
    totals.withItemDiscount += priceAfterItemDiscount;
    totals.final = totals.withItemDiscount;
  });

  return totals;
};

export const SummaryTable = ({ items, amounts, currency, bundles, exporting = false }) => {
  const styles = useTableStyles(exporting);
  const flatItems = processItems(items);
  const bundleTotals = bundles.map(bundle => ({
    bundle,
    totals: calculateBundleTotals(flatItems, amounts, bundle)
  })).filter(({ totals }) => totals.withoutDiscount > 0);
  
  if (bundleTotals.length === 0) return null;

  return (
    <div className="mt-8">
      <table className={styles.container}>
        <colgroup>
          <col className="w-full" /> {/* Text column */}
          <col className="w-full" /> {/* Spacer column */}
          {bundleTotals.map((_, index) => (
            <col key={index} className={styles.columnWidths.bundle} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className={`${styles.headerCell} text-left px-4 py-3`}>
              Položka
            </th>
            <th /> {/* Empty spacer cell */}
            {bundleTotals.map(({ bundle }, index) => (
              <th 
                key={bundle.id}
                className={`${styles.packageHeaderCell} text-right text-white ${styles.columnWidths.bundle} ${styles.getBundleHeaderBorderClasses(index)} px-4 py-3`}
                style={{ backgroundColor: getColorHex(index) }}
              >
                <div className={styles.centerWrapper}>
                  {bundle.name}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${styles.bodyCell} ${styles.itemName.item} px-4 py-3`}>
              Cena bez slev
            </td>
            <td /> {/* Empty spacer cell */}
            {bundleTotals.map(({ bundle, totals }, index) => (
              <td 
                key={bundle.id}
                className={`${styles.packageBodyCell} text-right ${styles.columnWidths.bundle} ${styles.getBundleBorderClasses(index)} px-4 py-3`}
              >
                <div className={styles.centerWrapper}>
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-700">
                      {formatPrice(totals.withoutDiscount, currency)}
                    </div>
                  </div>
                </div>
              </td>
            ))}
          </tr>
          <tr>
            <td className={`${styles.bodyCell} ${styles.itemName.item} px-4 py-3`}>
              Po globální slevě ({amounts.globalDiscount}%)
            </td>
            <td /> {/* Empty spacer cell */}
            {bundleTotals.map(({ bundle, totals }, index) => (
              <td 
                key={bundle.id}
                className={`${styles.packageBodyCell} text-right ${styles.columnWidths.bundle} ${styles.getBundleBorderClasses(index)} px-4 py-3`}
              >
                <div className={styles.centerWrapper}>
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-700">
                      {formatPrice(totals.withGlobalDiscount, currency)}
                    </div>
                    <div className={styles.priceNote}>
                      (-{formatPrice(totals.withoutDiscount - totals.withGlobalDiscount, currency)})
                    </div>
                  </div>
                </div>
              </td>
            ))}
          </tr>
          <tr>
            <td className={`${styles.bodyCell} ${styles.itemName.item} px-4 py-3`}>
              Po slevách na položkách
            </td>
            <td /> {/* Empty spacer cell */}
            {bundleTotals.map(({ bundle, totals }, index) => (
              <td 
                key={bundle.id}
                className={`${styles.packageBodyCell} text-right ${styles.columnWidths.bundle} ${styles.getBundleBorderClasses(index)} px-4 py-3`}
              >
                <div className={styles.centerWrapper}>
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-700">
                      {formatPrice(totals.withItemDiscount, currency)}
                    </div>
                    <div className={styles.priceNote}>
                      (-{formatPrice(totals.withGlobalDiscount - totals.withItemDiscount, currency)})
                    </div>
                  </div>
                </div>
              </td>
            ))}
          </tr>
          <tr className="bg-gray-50">
            <td className={`${styles.bodyCell} ${styles.itemName.category} px-4 py-3`}>
              Celková cena
            </td>
            <td /> {/* Empty spacer cell */}
            {bundleTotals.map(({ bundle, totals }, index) => (
              <td 
                key={bundle.id}
                className={`${styles.packageBodyCell} text-right ${styles.columnWidths.bundle} ${styles.getBundleBorderClasses(index)} px-4 py-3`}
              >
                <div className={styles.centerWrapper}>
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(totals.final, currency)}
                    </div>
                    <div className={styles.priceNote}>
                      (-{formatPrice(totals.withoutDiscount - totals.final, currency)})
                    </div>
                  </div>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};