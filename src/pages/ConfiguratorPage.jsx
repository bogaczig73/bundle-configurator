import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { BundleTable } from '../components/Table/BundleTable';
import Modal from '../components/Modal';
import SettingsModal from '../components/SettingsModal';
import { usePersistedSettings } from '../hooks/usePersistedSettings';
function ConfiguratorPage() {
  const { bundleId } = useParams();
  const { 
    loading, 
    error, 
    processedItems, 
    packages,  
    bundleData,
    users,
    saveConfiguration,
    setError,
    setProcessedItems
  } = useConfigData(bundleId);
  const [amounts, setAmounts] = useState({
    amounts: {},
    discount: {},
    fixace: {}
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configName, setConfigName] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showIndividualDiscount, setShowIndividualDiscount] = usePersistedSettings('showIndividualDiscount', false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showFixace, setShowFixace] = usePersistedSettings('showFixace', false);

  const customers = useMemo(() => {
    return users.filter(user => user.role === 'customer');
  }, [users]);

  useEffect(() => {
    if (bundleData?.amounts) {
      setAmounts({
        amounts: bundleData.amounts,
        discount: {},
        fixace: {}
      });
    }
  }, [bundleData]);

  const handleAmountChange = (itemId, value, field = 'amounts', subItemId = null) => {
    setAmounts(prev => {
      const newAmounts = { ...prev };
      
      if (subItemId) {
        // Handle subitem discounts
        if (!newAmounts[field]) {
          newAmounts[field] = {};
        }
        newAmounts[field][subItemId] = Number(value);

        // If parent discount changes, reset subitem discounts
        if (field === 'discount' && !subItemId) {
          const subitems = ['Fixované položky', 'Položky nad rámec fixace'];
          subitems.forEach(subitem => {
            delete newAmounts[field][subitem];
          });
        }
      } else {
        // Handle regular amount changes
        if (!newAmounts[field]) {
          newAmounts[field] = {};
        }
        newAmounts[field][itemId] = Number(value);
      }
      
      return newAmounts;
    });
  };

  const handleSaveConfig = async () => {
    if (!configName || !selectedCustomer) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await saveConfiguration({
        name: configName,
        customerId: selectedCustomer,
        amounts: amounts.amounts,
        discount: amounts.discount,
        fixace: amounts.fixace
      });
      
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSettingChange = (setting, value) => {
    if (setting === 'showIndividualDiscount') {
      setShowIndividualDiscount(value);
    } else if (setting === 'showFixace') {
      setShowFixace(value);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {bundleId ? `Bundle ${bundleId}` : 'New Bundle Configuration'}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Configuration
                </button>
              </div>
            </div>
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : error ? (
            <div className="p-6 text-red-600">
              {error}
            </div>
          ) : (
            <div className="p-6">
              <BundleTable
                bundles={packages}
                items={processedItems || []}
                onAmountChange={handleAmountChange}
                amounts={amounts}
                showIndividualDiscount={showIndividualDiscount}
                showFixace={showFixace}
              />
              
            </div>
          )}
        </main>

        {/* Add Modal */}
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Save Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Configuration Name</label>
                  <input
                    type="text"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveConfig}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Add Settings Modal */}
        <SettingsModal
          show={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          settings={{ 
            showIndividualDiscount,
            showFixace
          }}
          onSettingChange={handleSettingChange}
        />
      </div>
    </div>
  );
}

export default ConfiguratorPage;
