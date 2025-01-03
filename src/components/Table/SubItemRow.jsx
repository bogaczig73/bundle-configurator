import React from 'react';
import { 
  getItemPrice, 
  getItemSelected, 
  getItemDiscount,
  formatPrice,
  isBundleActive,
  isBundleDisabled
} from '../../utils/tableUtils';

import { getColorHex } from './useTableStyles';


export function SubItemRow({ 
  content, 
  bundles, 
  amounts, 
  tableStyles, 
  parentItem, 
  type,
  showIndividualDiscount = false, 
  showFixace = false,
  onDiscountChange,
  readonly = false,
  enableRowSelection = false
}) {

  // Calculate displayed amount based on type
  const getDisplayedAmount = () => {
    if (type === 'fixace') {
      return '-';
    } else if (type === 'over') {
      const parentAmount = amounts.amounts[parentItem.id] || 0;
      const parentFixace = amounts.fixace[parentItem.id] || 0;
      // Sum up all discounted amounts across bundles
      const totalDiscountedAmount = bundles.reduce((sum, bundle) => {
        const packageInfo = parentItem.packages?.find(p => p.packageId === bundle.id);
        return sum + (packageInfo?.discountedAmount || 0);
      }, 0);
      return Math.max(0, parentAmount - parentFixace - totalDiscountedAmount);
    }
    return parentItem.amount;
  };

  // Add helper function to get discount note
  const getDiscountNote = () => {
    if (type === 'over') {
      // Sum up all discounted amounts across bundles
      const totalDiscountedAmount = bundles.reduce((sum, bundle) => {
        const packageInfo = parentItem.packages?.find(p => p.packageId === bundle.id);
        return sum + (packageInfo?.discountedAmount || 0);
      }, 0);
      return totalDiscountedAmount > 0 ? `First ${totalDiscountedAmount} in price` : '';
    }
    return '';
  };

  // Calculate displayed fixace based on type
  const getDisplayedFixace = () => {
    if (type === 'fixace') {
      return amounts.fixace[parentItem.id] || 0;
    } else if (type === 'over') {
      return '-';
    }
    return parentItem.fixace;
  };

  const calculateFinalPrice = (basePrice, type, amounts, parentItem, bundle) => {
    const discountKey = `${parentItem.id}_${type === 'fixace' ? 'fixed_items' : 'over_fixation_items'}`;
    const discountedAmount = getItemDiscount(parentItem, bundle.id);
    const discountPercentage = amounts.discount?.[discountKey] ?? parentItem.discount ?? 0;
    
    // Calculate applicable units based on type
    let applicableUnits = 0;
    if (type === 'fixace') {
      applicableUnits = amounts.fixace[parentItem.id] || 0;
    } else if (type === 'over') {
      const totalAmount = amounts.amounts[parentItem.id] || 0;
      const fixaceAmount = amounts.fixace[parentItem.id] || 0;
      applicableUnits = Math.max(0, totalAmount - fixaceAmount - discountedAmount);
    }

    // Apply the discount to the price
    const priceAfterDiscount = basePrice * (1 - discountPercentage / 100);

    // Calculate final price
    const finalPrice = priceAfterDiscount * applicableUnits;

    return {
      finalPrice,
      applicableUnits,
      pricePerUnit: basePrice,
      discountedAmount,
      discountPercentage
    };
  };

  return (
    <tr className={`${tableStyles.itemRow} bg-gray-50`}>
      {enableRowSelection && (
        <td className={`${tableStyles.bodyCell} w-10`}>
          <div className={tableStyles.centerWrapper}></div>
        </td>
      )}
      <td className={`${tableStyles.columnWidths.details} ${tableStyles.bodyCell}`}>
        <div className="flex flex-col pl-8">
          <span className={tableStyles.itemName.item}>
            {content}
          </span>
        </div>
      </td>

      <td className={`${tableStyles.columnWidths.amount} ${tableStyles.bodyCell}`}>
        <div className={tableStyles.centerWrapper}>
          {parentItem.checkbox ? (
            <input
              type="checkbox"
              checked={false}
              disabled={true}
              className={tableStyles.checkbox}
            />
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-gray-700 text-xs">
                {getDisplayedAmount()}
              </span>
              {getDiscountNote() && (
                <span className="text-xs text-gray-500">
                  {getDiscountNote()}
                </span>
              )}
            </div>
          )}
        </div>
      </td>

      {showFixace && (
        <td className={`${tableStyles.columnWidths.fixace} ${tableStyles.bodyCell}`}>
          <div className={tableStyles.centerWrapper}>
            <span className="text-gray-700 text-xs">
              {getDisplayedFixace()}
            </span>
          </div>
        </td>
      )}

      {showIndividualDiscount && (
        <td className={`${tableStyles.columnWidths.fixace} ${tableStyles.bodyCell}`}>
          <div className={tableStyles.centerWrapper}>
            {readonly ? (
              <span className="text-gray-700 text-xs">
                {amounts.discount?.[`${parentItem.id}_${type === 'fixace' ? 'fixed_items' : 'over_fixation_items'}`] ?? parentItem.discount ?? 0}%
              </span>
            ) : (
              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const discountKey = `${parentItem.id}_${type === 'fixace' ? 'fixed_items' : 'over_fixation_items'}`;
                    const currentDiscount = amounts.discount?.[discountKey] ?? parentItem.discount ?? 0;
                    onDiscountChange(discountKey, Math.max(0, currentDiscount - 5));
                  }}
                  className={tableStyles.inputCounterButton + " rounded-s-md"}
                >
                  <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                  </svg>
                </button>
                
                <input
                  type="text"
                  min={0}
                  max={100}
                  value={amounts.discount?.[`${parentItem.id}_${type === 'fixace' ? 'fixed_items' : 'over_fixation_items'}`] ?? parentItem.discount ?? 0}
                  onChange={(e) => {
                    e.stopPropagation();
                    const value = Math.min(100, Math.max(0, Number(e.target.value)));
                    onDiscountChange(`${parentItem.id}_${type === 'fixace' ? 'fixed_items' : 'over_fixation_items'}`, value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={tableStyles.numberInput}
                />
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const discountKey = `${parentItem.id}_${type === 'fixace' ? 'fixed_items' : 'over_fixation_items'}`;
                    const currentDiscount = amounts.discount?.[discountKey] ?? parentItem.discount ?? 0;
                    onDiscountChange(discountKey, Math.min(100, currentDiscount + 5));
                  }}
                  className={tableStyles.inputCounterButton + " rounded-e-md"}
                >
                  <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </td>
      )}

      {bundles.map((bundle, index) => (
        <React.Fragment key={`subitem-${content}-${bundle.id}`}>
          <td className="w-[20px]" />
          <td className={`
            ${tableStyles.columnWidths.bundle} 
            ${tableStyles.packageBodyCell} 
            ${tableStyles.getBundleBorderClasses(index)}
            ${isBundleDisabled(bundle, index, amounts.amounts) ? tableStyles.inactiveBundle.cell : ''}
          `}>
            <div className="flex flex-col items-center">
              {getItemPrice(parentItem, bundle.id) === 0 ? (
                <span className="">
                  {getItemSelected(parentItem, bundle.id) ? (
                    <svg id="Vrstva_1" data-name="Vrstva 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className={`w-12 h-12 scale-150`}>
                      <path fill={getColorHex(index)} d="m47.54,32.21l.31.44c-1.25.94-2.65,2.4-4.18,4.36s-2.71,3.8-3.52,5.5l-.65.44c-.54.38-.91.65-1.1.83-.08-.28-.24-.73-.5-1.35l-.25-.57c-.35-.82-.68-1.43-.98-1.82-.3-.39-.64-.65-1.02-.78.63-.67,1.21-1,1.74-1,.45,0,.95.61,1.5,1.84l.27.62c.99-1.67,2.26-3.29,3.81-4.87s3.07-2.79,4.55-3.63Z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className={`w-12 h-12 scale-150`}>
                      <path fill="#7c7b7b" d="m33.76,38.05h8.46v.88h-8.46v-.88Z"/>
                    </svg>
                  )}
                </span>
              ) : (
                <>
                  <span className="text-[11px] font-medium italic">
                    {(() => {
                      const priceInfo = calculateFinalPrice(
                        getItemPrice(parentItem, bundle.id),
                        type,
                        amounts,
                        parentItem,
                        bundle
                      );
                      return formatPrice(priceInfo.finalPrice);
                    })()}
                  </span>
                  {/* <span className="text-[10px] text-gray-500 italic">
                    {parentItem.individual ? 'individuální paušál' : `${formatPrice(getItemPrice(parentItem, bundle.id))} za kus`}
                  </span> */}
                  <span className="text-[10px] text-gray-500 italic">
                    {(getItemDiscount(parentItem, bundle.id) > 0 ? ` První ${getItemDiscount(parentItem, bundle.id)} v ceně` : '')}
                  </span>
                  {((amounts.discount?.[`${parentItem.id}_${type === 'fixace' ? 'fixed_items' : 'over_fixation_items'}`] ?? parentItem.discount ?? 0) > 0) && (
                    <span className="text-[10px] text-gray-500 italic">
                      {`Discount: ${amounts.discount?.[`${parentItem.id}_${type === 'fixace' ? 'fixed_items' : 'over_fixation_items'}`] ?? parentItem.discount ?? 0}%`}
                    </span>
                  )}
                </>
              )}
            </div>
          </td>
        </React.Fragment>
      ))}
    </tr>
  );
} 