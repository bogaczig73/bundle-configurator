import React from 'react';
import { getColorHex } from './useTableStyles';
import { SubItemRow } from './SubItemRow';
import { useTableStyles } from './useTableStyles';
import { Item } from '../../types/Item';
import { roundPrice, formatPrice } from '../../utils/priceUtils';
import { useTable } from './TableContext';
import { findCategoryById, applyCategoryDiscount } from '../../utils/categoryUtils';

export const TableRow = ({ item, tableStyles }) => {
  const { 
    bundles,
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
    settings,
    isBundleActive,
    isBundleInactive,
    processedItems
  } = useTable();

  const [isExpanded, setIsExpanded] = React.useState(false);
  // Convert plain item object to Item instance if it isn't already
  const itemInstance = item instanceof Item ? item : new Item(item);
  // Skip if this is a category row
  if (itemInstance.type === 'category') {
    return (
      <tr className={`
        ${itemInstance.depth > 0 ? `pl-${itemInstance.depth * 4}` : ''}
      `}
        data-category-row="true"
        data-category-id={itemInstance.id}
      >
        {enableRowSelection && (
          <td className={`${tableStyles.bodyCell} w-10`} data-selector-column>
            <div className={tableStyles.centerWrapper}></div>
          </td>
        )}
        <td className={`
          ${tableStyles.columnWidths.details} 
          ${tableStyles.bodyCell}
          ${tableStyles.categoryRow}
        `}>
          <div className="flex flex-col">
            <span className={tableStyles.itemName.category}>
              {itemInstance.name}
            </span>
            {itemInstance.note && (
              <span className={tableStyles.itemNote}>
                {itemInstance.note}
              </span>
            )}
          </div>
        </td>

        <td className={`
          ${tableStyles.columnWidths.amount} 
          ${tableStyles.bodyCell}
          ${tableStyles.categoryRow}
        `}>
          <div className={tableStyles.centerWrapper}></div>
        </td>

        {showFixace && (
          <td className={`
            ${tableStyles.columnWidths.fixace} 
            ${tableStyles.bodyCell}
            ${tableStyles.categoryRow}
          `}>
            <div className={tableStyles.centerWrapper}></div>
          </td>
        )}

        {showIndividualDiscount && (
          <td className={`
            ${tableStyles.columnWidths.fixace} 
            ${tableStyles.bodyCell}
            ${tableStyles.categoryRow}
          `}>
            <div className={tableStyles.centerWrapper}>
              {readonly ? (
                <span className={tableStyles.itemAmount}>
                  {amounts.categoryDiscount?.[itemInstance.id] ? `${amounts.categoryDiscount?.[itemInstance.id]}%` : '-'}
                </span>
              ) : (
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const category = findCategoryById(processedItems, itemInstance.id);
                      const currentValue = amounts.categoryDiscount?.[itemInstance.id] || 0;
                      applyCategoryDiscount({
                        category,
                        value: Math.max(0, currentValue - 5),
                        showFixace,
                        onAmountChange,
                        amounts
                      });
                    }}
                    className={tableStyles.inputCounterButton + " rounded-s-md"}
                  >
                    <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                    </svg>
                  </button>

                  <input
                    type="text"
                    min={0}
                    max={100}
                    value={amounts.categoryDiscount?.[itemInstance.id] || 0}
                    onChange={(e) => {
                      e.stopPropagation();
                      const value = Math.min(100, Math.max(0, Number(e.target.value)));
                      const category = findCategoryById(processedItems, itemInstance.id);
                      applyCategoryDiscount({
                        category,
                        value,
                        showFixace,
                        onAmountChange,
                        amounts
                      });
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={tableStyles.numberInput}
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const category = findCategoryById(processedItems, itemInstance.id);
                      const currentValue = amounts.categoryDiscount?.[itemInstance.id] || 0;
                      applyCategoryDiscount({
                        category,
                        value: Math.min(100, currentValue + 5),
                        showFixace,
                        onAmountChange,
                        amounts
                      });
                    }}
                    className={tableStyles.inputCounterButton + " rounded-e-md"}
                  >
                    <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </td>
        )}

        {bundles.map((bundle, index) => {
          const isActive = isBundleActive(bundle);
          const isInactive = isBundleInactive(bundle);

          return (
            <React.Fragment key={`${itemInstance.id}-${bundle.id}-group`}>
              <td className="!w-[20px] min-w-[20px]" />
              <td className={`
                ${tableStyles.columnWidths.bundle} 
                ${tableStyles.packageBodyCell} 
                ${tableStyles.getBundleBorderClasses(index)} 
                ${isActive ? tableStyles.activeBundle.cell : ''}
                ${isInactive ? tableStyles.inactiveBundle.cell : ''}
              `}>
              </td>
            </React.Fragment>
          );
        })}
      </tr>
    );
  }

  return (
    <>
      <tr
        className={`
          ${tableStyles.itemRow}
          ${itemInstance.depth > 0 ? `pl-${itemInstance.depth * 4}` : ''}
          ${showFixace ? 'cursor-pointer' : ''}
        `}
        onClick={() => showFixace && setIsExpanded(!isExpanded)}
        data-accordion-row="true"
        data-item-id={itemInstance.id}
        data-expanded={isExpanded}
      >
        {enableRowSelection && (
          <td className={`${tableStyles.bodyCell} w-10`} onClick={(e) => e.stopPropagation()} data-selector-column>
            <div className={tableStyles.centerWrapper}>
              <input
                type="checkbox"
                checked={selectedRows[itemInstance.id] || false}
                onChange={(e) => onRowSelect?.(itemInstance.id, e.target.checked)}
                className={tableStyles.checkbox}
              />
            </div>
          </td>
        )}
        <td className={`${tableStyles.columnWidths.details} ${tableStyles.bodyCell}`}>
          <div className={tableStyles.accordionWrapper}>
            {showFixace && (
              <svg
                className={`${tableStyles.accordionIcon} ${isExpanded ? tableStyles.accordionIconExpanded : ''
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
            <div className={tableStyles.accordionContent}>
              <div className={tableStyles.accordionName}>
              </div>
              <span className={tableStyles.itemName.item}>
                {itemInstance.name}
              </span>
              {itemInstance.note && (
                <span className={tableStyles.itemNote}>
                  {itemInstance.note}
                </span>
              )}
            </div>
          </div>
        </td>

        <td className={`${tableStyles.columnWidths.amount} ${tableStyles.bodyCell}`}>
          <div className={tableStyles.centerWrapper}>
            {itemInstance.isFreeForAllBundles() ? (
              <span className={tableStyles.freeItemText}>
                -
              </span>
            ) : itemInstance.checkbox ? (
              <input
                type="checkbox"
                checked={amounts.amounts[itemInstance.id] === 1}
                onChange={readonly ? undefined : (e) => onAmountChange(itemInstance.id, e.target.checked ? 1 : 0)}
                onClick={(e) => e.stopPropagation()}
                disabled={readonly}
                className={tableStyles.checkbox}
              />
            ) : readonly ? (
              <span className={tableStyles.itemAmount}>
                {amounts.amounts[itemInstance.id] || 0}
                </span>
            ) : (
              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAmountChange(itemInstance.id, Math.max(0, (amounts.amounts[itemInstance.id] || 0) - 1));
                  }}
                  className={tableStyles.inputCounterButton + " rounded-s-md"}
                >
                  <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                  </svg>
                </button>

                <input
                  type="text"
                  min={0}
                  value={amounts.amounts[itemInstance.id] || 0}
                  onChange={(e) => {
                    e.stopPropagation();
                    onAmountChange(itemInstance.id, Number(e.target.value));
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className={`${tableStyles.numberInput} ${(amounts.fixace[itemInstance.id] || 0) > (amounts.amounts[itemInstance.id] || 0) ? 'border-orange-300 bg-orange-50' : ''}`}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAmountChange(itemInstance.id, (amounts.amounts[itemInstance.id] || 0) + 1);
                  }}
                  className={tableStyles.inputCounterButton + " rounded-e-md"}
                >
                  <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </td>

        {showFixace && (
          <td className={`${tableStyles.columnWidths.fixace} ${tableStyles.bodyCell}`}>
            <div className={tableStyles.centerWrapper}>
              {itemInstance.isFreeForAllBundles() ? (
                <span className={tableStyles.freeItemText}>
                  -
                </span>
              ) : itemInstance.checkbox ? (
                <input
                  type="checkbox"
                  checked={amounts.fixace[itemInstance.id] === 1}
                  onChange={readonly ? undefined : (e) => onAmountChange(itemInstance.id, e.target.checked ? 1 : 0, 'fixace')}
                  onClick={(e) => e.stopPropagation()}
                  disabled={readonly}
                  className={tableStyles.checkbox}
                />
              ) : readonly ? (
                <span className={tableStyles.itemAmount}>
                  {amounts.fixace[itemInstance.id] || 0}
                </span>
              ) : (
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentFixace = amounts.fixace[itemInstance.id] || 0;
                      onAmountChange(itemInstance.id, Math.max(0, currentFixace - 1), 'fixace');
                    }}
                    className={tableStyles.inputCounterButton + " rounded-s-md"}
                  >
                    <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                    </svg>
                  </button>

                  <div className="relative">
                    <input
                      type="text"
                      min={0}
                      value={amounts.fixace[itemInstance.id] || 0}
                      onChange={(e) => {
                        e.stopPropagation();
                        onAmountChange(itemInstance.id, Number(e.target.value), 'fixace');
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`${tableStyles.numberInput} ${(amounts.fixace[itemInstance.id] || 0) > (amounts.amounts[itemInstance.id] || 0) ? 'border-orange-300 bg-orange-50' : ''}`}
                      data-tooltip-target="tooltip-default"
                    />
                    {(amounts.fixace[itemInstance.id] || 0) > (amounts.amounts[itemInstance.id] || 0) && (
                      <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 group">
                        <svg className="w-5 h-5 text-orange-500 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="invisible group-hover:visible absolute left-0 -top-8 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                          Množství nesmí být menší než fixované množství
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAmountChange(itemInstance.id, (amounts.fixace[itemInstance.id] || 0) + 1, 'fixace');
                    }}
                    className={tableStyles.inputCounterButton + " rounded-e-md"}
                  >
                    <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </td>
        )}

        {showIndividualDiscount && (
          <td className={`${tableStyles.columnWidths.fixace} ${tableStyles.bodyCell}`}>
            <div className={tableStyles.centerWrapper}>
              {itemInstance.isFreeForAllBundles() ? (
                <span className={tableStyles.freeItemText}>
                  -
                </span>
              ) : itemInstance.checkbox ? (
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  {!readonly && !showFixace && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const currentDiscount = amounts.discount[itemInstance.id] || 0;
                          onAmountChange(itemInstance.id, Math.max(0, currentDiscount - 5), 'discount');
                        }}
                        className={tableStyles.inputCounterButton + " rounded-s-md"}
                      >
                        <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                        </svg>
                      </button>

                      <input
                        type="text"
                        min={0}
                        max={100}
                        value={amounts.discount[itemInstance.id] || 0}
                        onChange={(e) => {
                          e.stopPropagation();
                          const value = Math.min(100, Math.max(0, Number(e.target.value)));
                          onAmountChange(itemInstance.id, value, 'discount');
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={tableStyles.numberInput}
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAmountChange(itemInstance.id, Math.min(100, (amounts.discount[itemInstance.id] || 0) + 5), 'discount');
                        }}
                        className={tableStyles.inputCounterButton + " rounded-e-md"}
                      >
                        <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                      </button>
                    </>
                  )}
                  {(readonly || showFixace) && (
                    <span className={tableStyles.itemAmount}>
                      {amounts.discount[itemInstance.id] ? `${amounts.discount[itemInstance.id]}%` : '-'}
                    </span>
                  )}
                </div>
              ) : readonly ? (
                <span className={tableStyles.itemAmount}>
                  {amounts.discount[itemInstance.id] ? `${amounts.discount[itemInstance.id]}%` : '-'}
                </span>
              ) : !showFixace ? (
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentDiscount = amounts.discount[itemInstance.id] || 0;
                      onAmountChange(itemInstance.id, Math.max(0, currentDiscount - 5), 'discount');
                    }}
                    className={tableStyles.inputCounterButton + " rounded-s-md"}
                  >
                    <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M1 1h16" />
                    </svg>
                  </button>

                  <input
                    type="text"
                    min={0}
                    max={100}
                    value={amounts.discount[itemInstance.id] || 0}
                    onChange={(e) => {
                      e.stopPropagation();
                      const value = Math.min(100, Math.max(0, Number(e.target.value)));
                      onAmountChange(itemInstance.id, value, 'discount');
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={tableStyles.numberInput}
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAmountChange(itemInstance.id, Math.min(100, (amounts.discount[itemInstance.id] || 0) + 5), 'discount');
                    }}
                    className={tableStyles.inputCounterButton + " rounded-e-md"}
                  >
                    <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                    </svg>
                  </button>
                </div>
              ) : (
                <span className={tableStyles.itemAmount}>
                  {amounts.discount[itemInstance.id] ? `${amounts.discount[itemInstance.id]}%` : '-'}
                </span>
              )}
            </div>
          </td>
        )}

        {bundles.map((bundle, index) => (
          <React.Fragment key={`${itemInstance.id}-${bundle.id}-group`}>
            
            <td className="!w-[20px] min-w-[20px]" />
            <td className={`
              ${tableStyles.columnWidths.bundle} 
              ${tableStyles.packageBodyCell} 
              ${tableStyles.getBundleBorderClasses(index)}
              ${isBundleActive(bundle) ? tableStyles.activeBundle.cell : ''}
              ${isBundleInactive(bundle) ? tableStyles.inactiveBundle.cell : ''}
            `}>
              <div className="flex flex-col items-center">
                {itemInstance.getPrice(bundle.id) === 0 || !itemInstance.isSelected(bundle.id) ? (
                  <span className="">
                    {itemInstance.isSelected(bundle.id) ? (
                      <svg id="Vrstva_1" data-name="Vrstva 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className={`w-12 h-12 scale-150`}>
                        <path fill={getColorHex(index)} d="m47.54,32.21l.31.44c-1.25.94-2.65,2.4-4.18,4.36s-2.71,3.8-3.52,5.5l-.65.44c-.54.38-.91.65-1.1.83-.08-.28-.24-.73-.5-1.35l-.25-.57c-.35-.82-.68-1.43-.98-1.82-.3-.39-.64-.65-1.02-.78.63-.67,1.21-1,1.74-1,.45,0,.95.61,1.5,1.84l.27.62c.99-1.67,2.26-3.29,3.81-4.87s3.07-2.79,4.55-3.63Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className={`w-12 h-12 scale-150`}>
                        <path fill="#7c7b7b" d="m33.76,38.05h8.46v.88h-8.46v-.88Z" />
                      </svg>
                    )}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-center">
                    {showFixace ? (
                      (() => {
                        // Calculate price for fixed items with individual or global discount
                        const fixedAmount = amounts.fixace[itemInstance.id] || 0;
                        const baseFixedPrice = itemInstance.getPrice(bundle.id);
                        const fixedDiscountKey = `${itemInstance.id}_fixed_items`;
                        const fixedDiscount = amounts.individualDiscounts?.[fixedDiscountKey] ?
                          amounts.discount?.[fixedDiscountKey] :
                          (!itemInstance.excludeFromGlobalDiscount ? amounts.globalDiscount ?? 0 : 0);
                        const fixedPrice = roundPrice(baseFixedPrice * fixedAmount * (1 - fixedDiscount / 100));

                        // Calculate price for items over fixace with its own discount
                        const overFixaceDiscount = amounts.discount?.[`${itemInstance.id}_over_fixation_items`] ?? 0;
                        const totalAmount = amounts.amounts[itemInstance.id] || 0;
                        const overFixaceAmount = Math.max(0, totalAmount - fixedAmount - itemInstance.getDiscount(bundle.id));
                        const overFixacePrice = Math.ceil(roundPrice(baseFixedPrice * overFixaceAmount * (1 - overFixaceDiscount / 100)));
                        // Apply final item discount and round
                        const discount = amounts.discount?.[itemInstance.id] ?? itemInstance.discount ?? 0;
                        const finalPrice = Math.ceil(roundPrice((fixedPrice + overFixacePrice) * (1 - discount / 100)));
                        return formatPrice(finalPrice, currency);
                      })()
                    ) : (
                      (() => {
                        const discount = amounts.discount?.[itemInstance.id] ?? itemInstance.discount ?? 0;
                        const amount = amounts.amounts[itemInstance.id] || 0;
                        const basePrice = itemInstance.getPrice(bundle.id);
                        const discountedAmount = Math.max(0, amount - itemInstance.getDiscount(bundle.id));
                        const priceBeforeDiscount = roundPrice(basePrice * discountedAmount);
                        const finalPrice = roundPrice(priceBeforeDiscount * (1 - discount / 100));
                        return formatPrice(finalPrice, currency);
                      })()
                    )}
                  </span>
                )}
                <span className="text-xs text-gray-500 italic text-center">
                  {itemInstance.getPrice(bundle.id) === 0 ? '' :
                    itemInstance.individual && itemInstance.isSelected(bundle.id) ? 'individuální paušál' : (
                      <>
                        {/* {`${formatPrice(itemInstance.getPrice(bundle.id))} za kus`} */}
                      </>
                    )
                  }
                </span>
                {itemInstance.packages?.find(p => p.packageId === bundle.id)?.note && (
                  <span className="text-xs text-gray-500 italic text-center">
                    {itemInstance.packages?.find(p => p.packageId === bundle.id)?.note}
                  </span>
                )}
                <span className="text-xs text-gray-500 italic text-center">
                  {(itemInstance.getDiscount(bundle.id) > 0 ? ` První ${itemInstance.getDiscount(bundle.id)} v ceně` : '')}
                </span>
                {((amounts.discount?.[itemInstance.id] ?? itemInstance.discount ?? 0) > 0) && (
                  <span className="text-xs text-gray-500 italic text-center">
                    {`Sleva: ${amounts.discount?.[itemInstance.id] ?? itemInstance.discount ?? 0}%`}
                  </span>
                )}
              </div>
            </td>
          </React.Fragment>
        ))}
      </tr>

      {/* Accordion subitems */}
      {showFixace && isExpanded && (
        <>
          <SubItemRow
            key={`${itemInstance.id}-fixed-items`}
            content="Fixované položky"
            parentItem={itemInstance}
            type="fixace"
            tableStyles={tableStyles}
            onDiscountChange={(discountKey, value) => {
              // Set individual discount flag
              onAmountChange(discountKey, value, 'discount');
              onAmountChange(discountKey, true, 'individualDiscounts');
            }}
          />
          <SubItemRow
            key={`${itemInstance.id}-over-fixation-items`}
            content="Položky nad rámec fixace"
            parentItem={itemInstance}
            type="over"
            tableStyles={tableStyles}
            onDiscountChange={(discountKey, value) => {
              onAmountChange(discountKey, value, 'discount');
            }}
          />
        </>
      )}
    </>
  );
};
