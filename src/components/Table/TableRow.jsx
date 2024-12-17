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
import { useTableStyles } from './useTableStyles';

export function TableRow({ item, bundles, amounts, onAmountChange, readonly = false }) {
    const tableStyles = useTableStyles();
  return (
    <tr 
      className={`
        ${item.type === 'category' ? '' : tableStyles.itemRow}
        ${item.depth > 0 ? `pl-${item.depth * 4}` : ''}
      `}
    >
      {/* Item Details Cell */}
      <td className={`
        ${tableStyles.columnWidths.details} 
        ${tableStyles.bodyCell}
        ${item.type === 'category' ? tableStyles.categoryRow : ''}
      `}>
        <div className="flex flex-col">
          <span className={item.type === 'category' ? tableStyles.itemName.category : tableStyles.itemName.item}>
            {item.name}
          </span>
          {item.note && (
            <span className={tableStyles.itemNote}>
              {item.note}
            </span>
          )}
        </div>
      </td>

      {/* Amount Cell */}
      <td className={`
        ${tableStyles.columnWidths.amount} 
        ${tableStyles.bodyCell}
        ${item.type === 'category' ? tableStyles.categoryRow : ''}
      `}>
        <div className={tableStyles.centerWrapper}>
          {item.type === 'item' && (
            isFreeForAllBundles(item) ? (
              <span className={tableStyles.freeItemText}>
                -
              </span>
            ) : item.checkbox ? (
              <input
                type="checkbox"
                checked={amounts[item.id] === 1}
                onChange={readonly ? undefined : (e) => onAmountChange(item.id, e.target.checked ? 1 : 0)}
                disabled={readonly}
                className={tableStyles.checkbox}
              />
            ) : readonly ? (
              <span className={` text-gray-700`}>
                {amounts[item.id] || 0}
              </span>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={() => onAmountChange(item.id, Math.max(0, (amounts[item.id] || 0) - 1))}
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
                  onChange={(e) => onAmountChange(item.id, Number(e.target.value))}
                  className={tableStyles.numberInput}
                />
                <button
                  onClick={() => onAmountChange(item.id, (amounts[item.id] || 0) + 1)}
                  className={tableStyles.inputCounterButton + " rounded-e-md"}
                >
                  <svg className={tableStyles.counterButtonSymbols} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                  </svg>
                </button>
              </div>
            )
          )}
        </div>
      </td>

      {/* Bundle Price Cells */}
      {bundles.map((bundle, index) => (
        <React.Fragment key={`${item.id}-${bundle.id}-group`}>
          <td className="w-[20px]" />
          <td className={`${tableStyles.columnWidths.bundle} ${tableStyles.packageBodyCell} ${tableStyles.getBundleBorderClasses(index)}`}>
            {item.type === 'item' && (
              <div className="flex flex-col items-center">
                {getItemPrice(item, bundle.id) === 0 ? (
                  <span className="">
                    {getItemSelected(item, bundle.id) ? (
                      <img 
                        src={getCheckmarkIcon(index)} 
                        alt="Included" 
                        className={`w-12 h-12 ${getColorClass(index)}`}
                      />
                    ) : (
                        <svg id="Vrstva_1" data-name="Vrstva 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" className={`w-12 h-12 ${getColorClass(index)}`}>
                        <path className={`${getColorClass(index)}`} d="m47.54,32.21l.31.44c-1.25.94-2.65,2.4-4.18,4.36s-2.71,3.8-3.52,5.5l-.65.44c-.54.38-.91.65-1.1.83-.08-.28-.24-.73-.5-1.35l-.25-.57c-.35-.82-.68-1.43-.98-1.82-.3-.39-.64-.65-1.02-.78.63-.67,1.21-1,1.74-1,.45,0,.95.61,1.5,1.84l.27.62c.99-1.67,2.26-3.29,3.81-4.87s3.07-2.79,4.55-3.63Z"/>
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
            )}
          </td>
        </React.Fragment>
      ))}
    </tr>
  );
}
