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

          <col className={styles.columnWidths.details} />
          {bundleTotals.map((_, index) => (
            <React.Fragment key={index}>
              <col className="w-[20px]" />
              <col className={styles.columnWidths.bundle} />
            </React.Fragment>
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className={`${styles.headerCell} text-left ${styles.columnWidths.details}`}>
              Položka
            </th>
            {bundleTotals.map(({ bundle }, index) => (
              <React.Fragment key={bundle.id}>
                <th className="w-[20px]" />
                <th 
                  className={`${styles.packageHeaderCell} text-right text-white w-32 px-[5px] ${styles.getBundleHeaderBorderClasses(index)}`}
                  style={{ backgroundColor: getColorHex(index) }}
                >
                  <div className={styles.centerWrapper}>
                    {bundle.name}
                  </div>
                </th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${styles.bodyCell} ${styles.itemName.item} ${styles.columnWidths.details}`}>
              Cena bez slev
            </td>
            {bundleTotals.map(({ bundle, totals }, index) => (
              <React.Fragment key={bundle.id}>
                
                <td className="w-[20px]" />
                <td 
                  className={`${styles.packageBodyCell} text-right w-32 px-[5px] ${styles.getBundleBorderClasses(index)}`}
                >
                  <div className={styles.centerWrapper}>
                    <div className="text-sm text-gray-700">
                      {formatPrice(totals.withoutDiscount, currency)}
                    </div>
                  </div>
                </td>
              </React.Fragment>
            ))}
          </tr>
          <tr>
            <td className={`${styles.bodyCell} ${styles.itemName.item} ${styles.columnWidths.details}`}>
              Po globální slevě ({amounts.globalDiscount}%)
            </td>
            {bundleTotals.map(({ bundle, totals }, index) => (
              <React.Fragment key={bundle.id}>
                
                <td className="w-[20px]" />
                <td 
                  className={`${styles.packageBodyCell} text-right w-32 px-[5px] ${styles.getBundleBorderClasses(index)}`}
                >
                  <div className={styles.centerWrapper}>
                    <div className="text-sm text-gray-700">
                      {formatPrice(totals.withGlobalDiscount, currency)}
                    </div>
                    <div className={styles.priceNote}>
                      (-{formatPrice(totals.withoutDiscount - totals.withGlobalDiscount, currency)})
                    </div>
                  </div>
                </td>
              </React.Fragment>
            ))}
          </tr>
          <tr>
            <td className={`${styles.bodyCell} ${styles.itemName.item} ${styles.columnWidths.details}`}>
              Po slevách na položkách
            </td>

            {bundleTotals.map(({ bundle, totals }, index) => (
              <React.Fragment key={bundle.id}>
                
                <td className="w-[20px]" />
                <td 
                  className={`${styles.packageBodyCell} text-right w-32 px-[5px] ${styles.getBundleBorderClasses(index)}`}
                >
                  <div className={styles.centerWrapper}>
                    <div className="text-sm text-gray-700">
                      {formatPrice(totals.withItemDiscount, currency)}
                    </div>
                    <div className={styles.priceNote}>
                      (-{formatPrice(totals.withGlobalDiscount - totals.withItemDiscount, currency)})
                    </div>
                  </div>
                </td>
              </React.Fragment>
            ))}
          </tr>
          <tr className="bg-gray-50">
            <td className={`${styles.bodyCell} ${styles.itemName.category} ${styles.columnWidths.details}`}>
              Celková cena
            </td>
            {bundleTotals.map(({ bundle, totals }, index) => (
              <React.Fragment key={bundle.id}>
                <td className="w-[20px]" />
                <td 
                  className={`${styles.packageBodyCell} text-right w-32 px-[5px] ${styles.getBundleBorderClasses(index)}`}
                >
                  <div className={styles.centerWrapper}>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(totals.final, currency)}
                    </div>
                    <div className={styles.priceNote}>
                      (-{formatPrice(totals.withoutDiscount - totals.final, currency)})
                    </div>
                  </div>
                </td>
              </React.Fragment>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};