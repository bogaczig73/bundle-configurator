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


export function SubItemRow({ content, bundles, amounts, tableStyles, parentItem }) {
  return (
    <tr className={`${tableStyles.itemRow} bg-gray-50`}>
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
            <span className="text-gray-700">
              {amounts[parentItem.id] || 0}
            </span>
          )}
        </div>
      </td>

      <td className={`${tableStyles.columnWidths.fixace} ${tableStyles.bodyCell}`}>
        <div className={tableStyles.centerWrapper}>
          <span className="text-gray-700">
            {amounts[parentItem.id] || 0}
          </span>
        </div>
      </td>

      {bundles.map((bundle, index) => (
        <React.Fragment key={`subitem-${content}-${bundle.id}`}>
          <td className="w-[20px]" />
          <td className={`${tableStyles.columnWidths.bundle} ${tableStyles.packageBodyCell} ${tableStyles.getBundleBorderClasses(index)}`}>
            <div className="flex flex-col items-center">
              {getItemPrice(parentItem, bundle.id) === 0 ? (
                <span className="">
                  {getItemSelected(parentItem, bundle.id) ? (
                    <img 
                      src={getCheckmarkIcon(index)} 
                      alt="Included" 
                      className={`w-12 h-12 ${getColorClass(index)}`}
                    />
                  ) : '-'}
                </span>
              ) : (
                <>
                  <span className="text-xs font-medium">
                    {formatPrice(getItemPrice(parentItem, bundle.id) * (Math.max(0, amounts[parentItem.id] - getItemDiscount(parentItem, bundle.id)) || 0))}
                  </span>
                  <span className="text-xs text-gray-500">
                    {parentItem.individual ? 'individuální paušál' : `${formatPrice(getItemPrice(parentItem, bundle.id))} per unit`}
                  </span>
                </>
              )}
            </div>
          </td>
        </React.Fragment>
      ))}
    </tr>
  );
} 