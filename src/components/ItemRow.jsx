import React from 'react';
import AmountInput from './AmountInput';

function ItemRow({ item, amounts, bundles, onAmountChange, calculateItemTotal, indent = false }) {
  // console.log('item', JSON.stringify(item, null, 2));
  return (
    <React.Fragment>
      {/* Item Name */}
      <div className={`p-2 border-b flex flex-col ${indent ? 'pl-6' : ''}`}>
        <span className="text-sm">{item.name}</span>
        {item.note && (
          <span className="text-xs text-gray-500">Note: {item.note}</span>
        )}
      </div>

      {/* Amount Input */}
      <AmountInput 
        value={amounts[item.id] || 0}
        onChange={(value) => onAmountChange(item.id, value)}
      />
      
      {/* Bundle Calculations */}
      {bundles.map((bundle) => (
        <div 
          key={`${bundle.id}-${item.id}`} 
          className="p-2 border-b bg-white"
        >
          {bundle.items?.[item.id]?.selected && (
            <div className="flex flex-col items-center gap-1">
              <div className="text-sm">
                {calculateItemTotal(bundle.id, item.id)} CZK
              </div>
            </div>
          )}
        </div>
      ))}
    </React.Fragment>
  );
}

export default ItemRow; 