import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { BundleTable } from '../components/Table/BundleTable';
import Modal from '../components/Modal';

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
    setError
  } = useConfigData(bundleId);
  const [amounts, setAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configName, setConfigName] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const customers = useMemo(() => {
    return users.filter(user => user.role === 'customer');
  }, [users]);

  useEffect(() => {
    if (bundleData?.amounts) {
      setAmounts(bundleData.amounts);
    }
  }, [bundleData]);

  const handleAmountChange = (itemId, amount) => {
    setAmounts(prev => ({ ...prev, [itemId]: Number(amount) }));
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
        amounts
      });
      
      setIsModalOpen(false);
      // Optionally show success message or redirect
    } catch (err) {
      setError(err.message);
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
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Configuration
              </button>
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
      </div>
    </div>
  );
}

export default ConfiguratorPage;
