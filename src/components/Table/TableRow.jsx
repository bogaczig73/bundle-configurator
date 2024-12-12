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

export function TableRow({ item, bundles, amounts, onAmountChange }) {
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
                onChange={(e) => onAmountChange(item.id, e.target.checked ? 1 : 0)}
                className={tableStyles.checkbox}
              />
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
                      <img 
                        src={crossIcon} 
                        alt="Not included" 
                        className={`w-12 h-12 ${getColorClass(index)}`}
                      />
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
                <span className="text-xs text-gray-500">
                  {getItemPrice(item, bundle.id) === 0 ? '' : 
                    `Počet zlevněných kusů: ${item.packages[0].old}`}
                </span>
              </div>
            )}
          </td>
        </React.Fragment>
      ))}
    </tr>
  );
}
