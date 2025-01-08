import React, { useState, useEffect, useMemo } from "react";
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { BundleTable } from '../components/Table/BundleTable';
import Modal from '../components/Modal';
import SettingsModal from '../components/SettingsModal';
import { usePersistedSettings } from '../hooks/usePersistedSettings';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getDefaultItemsForCurrency } from '../data/items';
import { CURRENCIES } from '../hooks/useConfigData';
import { useTableStyles } from '../components/Table/useTableStyles';


// // Available currencies
// const CURRENCIES = [
//   { code: 'CZK', symbol: 'Kč', name: 'Český' },
//   { code: 'EUR', symbol: '€', name: 'Slovenský' },
// ];

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
    setProcessedItems,
    setLoading,
    loadItemsForCurrency
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
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('CZK');

  const customers = useMemo(() => {
    return users.filter(user => user.role === 'customer');
  }, [users]);

  // Load items based on selected currency
  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const items = await loadItemsForCurrency(selectedCurrency);
        setProcessedItems(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [selectedCurrency, setLoading, setError, setProcessedItems, loadItemsForCurrency]);

  useEffect(() => {
    if (bundleData?.amounts) {
      const convertedAmounts = Object.entries(bundleData.amounts).reduce((acc, [key, value]) => {
        acc[key.toString()] = value;
        return acc;
      }, {});

      setAmounts({
        amounts: convertedAmounts,
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
        // Convert itemId to string to ensure consistent key type
        const key = itemId.toString();
        newAmounts[field][key] = Number(value);
      }
      
      console.log('Updated amounts:', newAmounts);
      console.log('newAmounts', newAmounts);
      return newAmounts;
    });
  };

  const handleSaveConfig = async () => {
    if (!configName || !selectedCustomer) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const bundleId = `bundle_${Date.now()}_${Math.random().toString(36)}`;
      
      // Ensure we have valid amounts data
      const validItems = {};
      console.log('amounts', amounts);
      // Only include items that have actual values
      Object.entries(amounts.amounts || {}).forEach(([itemId, amount]) => {
        if (amount !== undefined && amount !== null) {
          validItems[itemId.toString()] = {
            amount: Number(amount) || 0,
            discount: Number(amounts.discount?.[itemId]) || 0,
            fixace: Number(amounts.fixace?.[itemId]) || 0,
            subItemDiscounts: {
              'fixace': Number(amounts.discount?.[`${itemId}_fixed_items`]) || 0,
              'over': Number(amounts.discount?.[`${itemId}_over_fixation_items`]) || 0
            }
          };
        }
      });

      // Ensure we have at least one valid item
      if (Object.keys(validItems).length === 0) {
        setError('Please add at least one item amount');
        return;
      }

      await saveConfiguration({
        id: bundleId,
        name: configName,
        customerId: selectedCustomer,
        items: validItems,
        status: 'draft',
        createdBy: '',
        globalDiscount: globalDiscount,
        currency: selectedCurrency
      });
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save configuration error:', err);
      setError(err.message || 'Error saving configuration');
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
                {bundleId ? `Bundle ${bundleId}` : 'Nová konfigurace'}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="currency" className="text-sm font-medium text-gray-700 w-full">
                    Jazyk balíčku:
                  </label>
                  <select
                    id="currency"
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className={useTableStyles().currencySelect}
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Globální sleva (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={globalDiscount}
                    onChange={(e) => setGlobalDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div> */}
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
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Uložit konfiguraci
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
            <div className="px-6">
              <BundleTable
                bundles={packages.map((pkg, index) => {
                  const userCount = amounts?.amounts?.[1] || 0;
                  
                  // Bundle is active if the user count (item ID 1) is less than or equal to its userLimit
                  const isActive = userCount <= pkg.userLimit;
                  
                  return {
                    ...pkg,
                    userLimit: isActive ? pkg.userLimit : 0
                  };
                })}
                items={processedItems || []}
                onAmountChange={handleAmountChange}
                amounts={{...amounts, globalDiscount}}
                showIndividualDiscount={showIndividualDiscount}
                showFixace={showFixace}
                currency={selectedCurrency}
              />
              
            </div>
          )}
        </main>

        {/* Add Modal */}
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Uložit konfiguraci</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Název konfigurace</label>
                  <input
                    type="text"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zákazník</label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Vyber zákazníka</option>
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
