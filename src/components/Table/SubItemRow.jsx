import React from 'react';
import { 
  getItemPrice, 
  getItemSelected, 
  getItemDiscount,
  formatPrice
} from '../../utils/tableUtils';

import { getColorHex } from './useTableStyles';


export function SubItemRow({ 
  content, 
  bundles, 
  amounts, 
  tableStyles, 
  parentItem, 
  showIndividualDiscount = false, 
  showFixace = false,
}) {

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
              {parentItem.amount}
            </span>
          )}
        </div>
      </td>

      {showFixace && (
        <td className={`${tableStyles.columnWidths.fixace} ${tableStyles.bodyCell}`}>
          <div className={tableStyles.centerWrapper}>
            <span className="text-gray-700">
                {parentItem.fixace}
            </span>
          </div>
        </td>
      )}

      {showIndividualDiscount && (
        <td className={`${tableStyles.columnWidths.fixace} ${tableStyles.bodyCell}`}>
          <div className={tableStyles.centerWrapper}>
            <span className="text-gray-700">
                {parentItem.discount}
            </span>
          </div>
        </td>
      )}

      {bundles.map((bundle, index) => (
        <React.Fragment key={`subitem-${content}-${bundle.id}`}>
          <td className="w-[20px]" />
          <td className={`${tableStyles.columnWidths.bundle} ${tableStyles.packageBodyCell} ${tableStyles.getBundleBorderClasses(index)}`}>
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
                  <span className="text-xs font-medium">
                    {formatPrice(parentItem.price * parentItem.amount)}
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