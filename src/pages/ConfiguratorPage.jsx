import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { BundleTable } from '../components/Table/BundleTable';
import { SummaryTable } from '../components/Table/SummaryTable';
import Modal from '../components/Modal';
import SettingsModal from '../components/SettingsModal';
import { usePersistedSettings } from '../hooks/usePersistedSettings';
import { CURRENCIES } from '../hooks/useConfigData';
import { useTableStyles } from '../components/Table/useTableStyles';
import { useCurrentUser } from '../api/users';
import { getBundleState } from '../utils/bundleUtils';
import FlyingImage from '../components/FlyingImage';

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
    fixace: {},
    individualDiscounts: {}
  });
  const { user } = useCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configName, setConfigName] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showIndividualDiscount, setShowIndividualDiscount] = usePersistedSettings('showIndividualDiscount', false);
  const [showSummaryTable, setShowSummaryTable] = usePersistedSettings('showSummaryTable', true);
  const [showCopyToFixationButton, setShowCopyToFixationButton] = usePersistedSettings('showCopyToFixationButton', true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showFixace, setShowFixace] = usePersistedSettings('showFixace', false);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState('CZK');
  const [isPrivate, setIsPrivate] = useState(false);
  const [activeBundles, setActiveBundles] = useState(packages.map(() => 'default'));
  const [showBubu, setShowBubu] = useState(false);

  // Helper function to find an item in the nested structure
  const findItemInCategories = useCallback((itemId, categories) => {
    for (const category of categories) {
      if (category.type === 'category' && category.children) {
        const item = category.children.find(i => i.id.toString() === itemId);
        if (item) return item;
        
        const foundInSubcategory = findItemInCategories(itemId, category.children.filter(child => child.type === 'category'));
        if (foundInSubcategory) return foundInSubcategory;
      }
    }
    return null;
  }, []);

  // Calculate which bundles should be active based on amounts
  const updateActiveBundles = useCallback((newAmounts) => {
    let foundActive = false;
    const bundleStates = packages.map((pkg, index) => {
      const stateInfo = getBundleState(pkg, index, newAmounts, processedItems, packages);
      
      // If this bundle would be active but we already found an active one,
      // force it to default state
      if (stateInfo.state === 'active' && foundActive) {
        return {
          ...pkg,
          userLimit: pkg.userLimit,
          isActive: 'default',
          state: 'default',
          stateReason: 'Another bundle is already active',
          stateDetails: stateInfo.details,
          nonSelectedItems: stateInfo.items
        };
      }

      // If this bundle is active, mark that we found one
      if (stateInfo.state === 'active') {
        foundActive = true;
      }

      return {
        ...pkg,
        userLimit: stateInfo.state !== 'inactive' ? pkg.userLimit : 0,
        isActive: stateInfo.state,
        state: stateInfo.state,
        stateReason: stateInfo.reason,
        stateDetails: stateInfo.details,
        nonSelectedItems: stateInfo.items
      };
    });
    setActiveBundles(bundleStates);
  }, [packages, processedItems]);

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

      const newAmounts = {
        amounts: convertedAmounts,
        discount: {},
        fixace: {},
        individualDiscounts: {}
      };

      // Restore individual discounts state
      Object.entries(bundleData.amounts).forEach(([itemId, itemData]) => {
        if (itemData.individualDiscounts) {
          if (itemData.individualDiscounts.fixace) {
            newAmounts.individualDiscounts[`${itemId}_fixed_items`] = true;
            newAmounts.discount[`${itemId}_fixed_items`] = itemData.subItemDiscounts?.fixace || 0;
          }
          if (itemData.individualDiscounts.over) {
            newAmounts.individualDiscounts[`${itemId}_over_fixation_items`] = true;
            newAmounts.discount[`${itemId}_over_fixation_items`] = itemData.subItemDiscounts?.over || 0;
          }
        }
      });

      setAmounts(newAmounts);

      // Load global discount if present
      if (bundleData.globalDiscount !== undefined) {
        setGlobalDiscount(bundleData.globalDiscount);
      }
    }
  }, [bundleData]);

  // Initial bundle states calculation
  useEffect(() => {
    updateActiveBundles(amounts);
  }, [updateActiveBundles, amounts]);

  const handleAmountChange = (itemId, value, field = 'amounts', subItemId = null) => {
    if (itemId.toString() === '1' && value.toString() === '666') {
      setShowBubu(false); // Reset first
      setTimeout(() => {
        setShowBubu(true);
        // Hide after animation
        setTimeout(() => {
          setShowBubu(false);
        }, 3000);
      }, 0);
    }

    setAmounts(prev => {
      const newAmounts = { ...prev };
      
      if (subItemId) {

        if (!newAmounts[field]) {
          newAmounts[field] = {};
        }
        newAmounts[field][subItemId] = Number(value);
        
        // Store flag for individually set discounts
        if (field === 'discount') {
          if (!newAmounts.individualDiscounts) {
            newAmounts.individualDiscounts = {};
          }
          newAmounts.individualDiscounts[subItemId] = true;
        }
      } else {
        // Handle regular amount changes
        if (!newAmounts[field]) {
          newAmounts[field] = {};
        }
        // Convert itemId to string to ensure consistent key type
        const key = itemId.toString();
        newAmounts[field][key] = Number(value);
        
        // Store flag for individually set discounts
        if (field === 'discount') {
          if (!newAmounts.individualDiscounts) {
            newAmounts.individualDiscounts = {};
          }
          newAmounts.individualDiscounts[key] = true;
        }

        // If showCopyToFixationButton is enabled and we're changing an amount, automatically copy to fixace
        if (field === 'amounts' && showCopyToFixationButton && showFixace) {
          if (!newAmounts.fixace) {
            newAmounts.fixace = {};
          }
          newAmounts.fixace[key] = Number(value);
        }
      }

      // Update active bundles whenever amounts change
      updateActiveBundles(newAmounts);
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
      
      const validItems = {};
      // Only include items that have actual values
      Object.entries(amounts.amounts || {}).forEach(([itemId, amount]) => {
        if (amount !== undefined && amount !== null) {
          validItems[itemId.toString()] = {
            amount: Number(amount) || 0,
            discount: Number(amounts.discount?.[itemId]) || 0,
            fixace: Number(amounts.fixace?.[itemId]) || 0,
            subItemDiscounts: {
              'over': Number(amounts.discount?.[`${itemId}_over_fixation_items`]) || 0,
              'fixace': Number(amounts.discount?.[`${itemId}_fixed_items`]) || 0
            },
            individualDiscounts: {
              'over': amounts.individualDiscounts?.[`${itemId}_over_fixation_items`] || false,
              'fixace': amounts.individualDiscounts?.[`${itemId}_fixed_items`] || false
            }
          };
        }
      });
      console.log('validItems', validItems);

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
        globalDiscount: Number(globalDiscount) || 0,
        currency: selectedCurrency,
        isPrivate: isPrivate
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
    } else if (setting === 'showSummaryTable') {
      setShowSummaryTable(value);
    } else if (setting === 'showCopyToFixationButton') {
      setShowCopyToFixationButton(value);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {showBubu && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
          <FlyingImage />
        </div>
      )}
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
                <div className="flex items-center gap-2">
                  <label htmlFor="globalDiscount" className="text-sm font-medium text-gray-700">
                    Globální sleva (%):
                  </label>
                  <input
                    id="globalDiscount"
                    type="number"
                    min="0"
                    max="100"
                    value={globalDiscount}
                    onChange={(e) => {
                      const newGlobalDiscount = Math.min(100, Math.max(0, Number(e.target.value)));
                      setGlobalDiscount(newGlobalDiscount);
                      
                      // Update all fixed items' individual discounts to match global discount
                      setAmounts(prev => {
                        const newAmounts = { ...prev };
                        // Reset individual discounts for fixed items
                        if (!newAmounts.individualDiscounts) {
                          newAmounts.individualDiscounts = {};
                        }
                        console.log(newAmounts.discount)
                        if (!newAmounts.discount) {
                          newAmounts.discount = {};
                        }
                        
                        // For each item that has amounts
                        Object.keys(newAmounts.amounts || {}).forEach(itemId => {
                          const fixedItemKey = `${itemId}_fixed_items`;
                          // Reset the individual discount flag and value
                          newAmounts.individualDiscounts[fixedItemKey] = false;
                          newAmounts.discount[fixedItemKey] = newGlobalDiscount;
                        });
                        return newAmounts;
                      });
                    }}
                    className="w-20 px-2 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
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
                bundles={activeBundles}
                items={processedItems || []}
                onAmountChange={handleAmountChange}
                onDiscountChange={(itemId, value) => handleAmountChange(itemId, value, 'discount')}
                amounts={amounts}
                showIndividualDiscount={showIndividualDiscount}
                showFixace={showFixace}
                currency={selectedCurrency}
                globalDiscount={globalDiscount}
                userRole={user?.role ?? 'customer'}
                settings={{
                  showCopyToFixationButton
                }}
              />
              
              {showSummaryTable && (
                <SummaryTable
                  items={processedItems || []}
                  amounts={amounts}
                  currency={selectedCurrency}
                  bundles={activeBundles}
                  globalDiscount={globalDiscount}
                  showIndividualDiscount={showIndividualDiscount}
                  showFixace={showFixace}
                />
              )}
            </div>
          )}
        </main>

        {/* Add Modal */}
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <div className="p-6 w-[600px] max-w-full">
              <h2 className="text-xl font-bold mb-4">Uložit konfiguraci</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Název konfigurace <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                      !configName ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500`}
                    required
                  />
                  {!configName && (
                    <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Zákazník <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 ${
                      !selectedCustomer ? 'border-red-300' : 'border-gray-300'
                    } focus:border-blue-500`}
                    required
                  >
                    <option value="">Vyber zákazníka</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.username}
                      </option>
                    ))}
                  </select>
                  {!selectedCustomer && (
                    <p className="mt-1 text-sm text-red-500">Toto pole je povinné</p>
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-900">
                    Soukromá konfigurace
                  </label>
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
                    disabled={loading || !configName || !selectedCustomer}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
            showFixace,
            showSummaryTable,
            showCopyToFixationButton
          }}
          onSettingChange={handleSettingChange}
          page="configurator"
        />
      </div>
    </div>
  );
}

export default ConfiguratorPage;
