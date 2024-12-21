import React from 'react';
import { 
  getItemPrice, 
  getItemSelected, 
  getItemDiscount, 
  isFreeForAllBundles,
  getCheckmarkIcon,
  getColorClass,
  formatPrice
} from '../../utils/tableUtils';
import crossIcon from '../../images/symbols/Zapor_znamenko.svg';
import { useTableStyles, getColorHex } from './useTableStyles';
import { SubItemRow } from './SubItemRow';

export function TableRow({ item, bundles, amounts, onAmountChange, readonly = false, showIndividualDiscount = false, showFixace = false }) {
    const tableStyles = useTableStyles();
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Skip if this is a category row
    if (item.type === 'category') {
      return (
        <tr className={`
          ${item.depth > 0 ? `pl-${item.depth * 4}` : ''}
        `}>
          <td className={`
            ${tableStyles.columnWidths.details} 
            ${tableStyles.bodyCell}
            ${tableStyles.categoryRow}
          `}>
            <div className="flex flex-col">
              <span className={tableStyles.itemName.category}>
                {item.name}
              </span>
              {item.note && (
                <span className={tableStyles.itemNote}>
                  {item.note}
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
              <div className={tableStyles.centerWrapper}></div>
            </td>
          )}

          {bundles.map((bundle, index) => (
            <React.Fragment key={`${item.id}-${bundle.id}-group`}>
              <td className="w-[20px]" />
              <td className={`${tableStyles.columnWidths.bundle} ${tableStyles.packageBodyCell} ${tableStyles.getBundleBorderClasses(index)}`}>
              </td>
            </React.Fragment>
          ))}
        </tr>
      );
    }

    return (
      <>
        <tr 
          className={`
            ${tableStyles.itemRow}
            ${item.depth > 0 ? `pl-${item.depth * 4}` : ''}
            cursor-pointer
          `}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <td className={`${tableStyles.columnWidths.details} ${tableStyles.bodyCell}`}>
            <div className={tableStyles.accordionWrapper}>
                  <svg
                    className={`${tableStyles.accordionIcon} ${
                      isExpanded ? tableStyles.accordionIconExpanded : ''
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
              <div className={tableStyles.accordionContent}>
                <div className={tableStyles.accordionName}>
                </div>
                  <span className={tableStyles.itemName.item}>
                    {item.name}
                  </span>
                {item.note && (
                  <span className={tableStyles.itemNote}>
                    {item.note}
                  </span>
                )}
              </div>
            </div>
          </td>

          <td className={`${tableStyles.columnWidths.amount} ${tableStyles.bodyCell}`}>
            <div className={tableStyles.centerWrapper}>
              {isFreeForAllBundles(item) ? (
                <span className={tableStyles.freeItemText}>
                  -
                </span>
              ) : item.checkbox ? (
                <input
                  type="checkbox"
                  checked={amounts[item.id] === 1}
                  onChange={readonly ? undefined : (e) => onAmountChange(item.id, e.target.checked ? 1 : 0)}
                  onClick={(e) => e.stopPropagation()}
                  disabled={readonly}
                  className={tableStyles.checkbox}
                />
              ) : readonly ? (
                <span className={`text-gray-700`}>
                  {amounts[item.id] || 0}
                </span>
              ) : (
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAmountChange(item.id, Math.max(0, (amounts[item.id] || 0) - 1));
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
                    value={amounts[item.id] || 0}
                    onChange={(e) => {
                      e.stopPropagation();
                      onAmountChange(item.id, Number(e.target.value));
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={tableStyles.numberInput}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAmountChange(item.id, (amounts[item.id] || 0) + 1);
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

          {showFixace && (
            <td className={`${tableStyles.columnWidths.fixace} ${tableStyles.bodyCell}`}>
              <div className={tableStyles.centerWrapper}>
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAmountChange(item.id, Math.max(0, (item.fixace || 0) - 1), 'fixace');
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
                    value={item.fixace || 0}
                    onChange={(e) => {
                      e.stopPropagation();
                      onAmountChange(item.id, Number(e.target.value), 'fixace');
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={tableStyles.numberInput}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAmountChange(item.id, (item.fixace || 0) + 1, 'fixace');
                    }}
                    className={tableStyles.inputCounterButton + " rounded-e-md"}
                  >
                    <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </td>
          )}

          {showIndividualDiscount && (
            <td className={`${tableStyles.columnWidths.fixace} ${tableStyles.bodyCell}`}>
              <div className={tableStyles.centerWrapper}>
                <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAmountChange(item.id, Math.max(0, (item.discount || 0) - 1), 'discount');
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
                    value={item.discount || 0}
                    onChange={(e) => {
                      e.stopPropagation();
                      onAmountChange(item.id, Number(e.target.value), 'discount');
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className={tableStyles.numberInput}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAmountChange(item.id, (item.discount || 0) + 1, 'discount');
                    }}
                    className={tableStyles.inputCounterButton + " rounded-e-md"}
                  >
                    <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </td>
          )}

          {bundles.map((bundle, index) => (
            <React.Fragment key={`${item.id}-${bundle.id}-group`}>
              <td className="w-[20px]" />
              <td className={`${tableStyles.columnWidths.bundle} ${tableStyles.packageBodyCell} ${tableStyles.getBundleBorderClasses(index)}`}>
                <div className="flex flex-col items-center">
                  {getItemPrice(item, bundle.id) === 0 ? (
                    <span className="">
                      {getItemSelected(item, bundle.id) ? (
                        // <img 
                        //   src={getCheckmarkIcon(index)} 
                        //   alt="Included" 
                        //   className={`w-12 h-12 ${getColorClass(index)}`}
                        // />
                        <svg  id="Vrstva_1" data-name="Vrstva 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className={`w-12 h-12 scale-150`}>
                           <path fill={getColorHex(index)} d="m47.54,32.21l.31.44c-1.25.94-2.65,2.4-4.18,4.36s-2.71,3.8-3.52,5.5l-.65.44c-.54.38-.91.65-1.1.83-.08-.28-.24-.73-.5-1.35l-.25-.57c-.35-.82-.68-1.43-.98-1.82-.3-.39-.64-.65-1.02-.78.63-.67,1.21-1,1.74-1,.45,0,.95.61,1.5,1.84l.27.62c.99-1.67,2.26-3.29,3.81-4.87s3.07-2.79,4.55-3.63Z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className={`w-12 h-12 scale-150`}>
                          <path fill="#7c7b7b" d="m33.76,38.05h8.46v.88h-8.46v-.88Z"/>
                        </svg>
                      )}
                    </span>
                  ) : (
                    <span className="text-xs font-medium">
                      {formatPrice(getItemPrice(item, bundle.id) * (Math.max(0, amounts[item.id] - getItemDiscount(item, bundle.id)) || 0))}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {getItemPrice(item, bundle.id) === 0 ? '' : 
                      item.individual ? 'individuální paušál' : `${formatPrice(getItemPrice(item, bundle.id))} per unit` + (getItemDiscount(item, bundle.id) > 0 ? ` / první ${getItemDiscount(item, bundle.id)} v ceně` : '')}
                  </span>
                </div>
              </td>
            </React.Fragment>
          ))}
        </tr>

        {/* Accordion subitems */}
        {isExpanded && (
          <>
            <SubItemRow 
              content="Fixované položky"
              bundles={bundles}
              amounts={amounts}
              tableStyles={tableStyles}
              parentItem={item}
              showIndividualDiscount={showIndividualDiscount}
              showFixace={showFixace}
            />
            <SubItemRow 
              content="Položky nad rámec fixace"
              bundles={bundles}
              amounts={amounts}
              tableStyles={tableStyles}
              parentItem={item}
              showIndividualDiscount={showIndividualDiscount}
              showFixace={showFixace}
            />
          </>
        )}
      </>
    );
}
