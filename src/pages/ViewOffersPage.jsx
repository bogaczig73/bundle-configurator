import React, { useState } from "react";
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { BundleTable } from '../components/Table/BundleTable';


// Bundle Picker Component - made more compact
const BundlePicker = ({ bundles, users, selectedBundle, onBundleSelect }) => (
  <div className="p-2 bg-white border-b">
    <div className="flex space-x-2 overflow-x-auto">
      {bundles.map((bundle) => (
        <div
          key={bundle.id}
          onClick={() => onBundleSelect(bundle)}
          className={`p-3 rounded-lg cursor-pointer border min-w-[180px] ${
            selectedBundle?.id === bundle.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="font-medium text-sm">
            {users[bundle.userId]?.username || 'Unknown User'}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Total: {bundle.totalPrice || 0} CZK
          </div>
          <div className="mt-1">
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              bundle.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {bundle.status || 'draft'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);


// Main Component
function ViewOffersPage() {
  const { loading, error, processedItems, packages} = useConfigData();
  const [bundles] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [users ] = useState({});
  const [amounts, setAmounts] = useState({});

  // Handle amount changes in the table
  const handleAmountChange = (itemId, amount) => {
    setAmounts(prev => ({ ...prev, [itemId]: amount }));
  };


  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 h-screen flex flex-col">
        <BundlePicker 
          bundles={bundles}
          users={users}
          selectedBundle={selectedBundle}
          onBundleSelect={setSelectedBundle}
        />
        
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <BundleTable
            bundles={packages}
            items={processedItems}
            onAmountChange={handleAmountChange}
            amounts={amounts}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewOffersPage; 

