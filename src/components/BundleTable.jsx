import React from 'react';

function BundleTable({ items, bundles, onItemToggle, onItemPriceChange }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            {bundles.map(bundle => (
              <th key={bundle.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {bundle.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item, index) => (
            <tr key={item.id} className={item.type === 'category' ? 'bg-gray-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ paddingLeft: `${item.depth * 20 + 24}px` }}>
                {item.name}
              </td>
              {bundles.map(bundle => (
                <td key={bundle.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.type === 'item' && (
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={item.prices?.find(p => p.packageId === bundle.id)?.selected ?? false}
                        onChange={() => onItemToggle(bundle.id, item.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        value={item.prices?.find(p => p.packageId === bundle.id)?.price ?? 0}
                        onChange={(e) => onItemPriceChange(bundle.id, item.id, e.target.value)}
                        className="block w-24 px-2 py-1 text-sm border border-gray-300 rounded"
                      />
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BundleTable; 