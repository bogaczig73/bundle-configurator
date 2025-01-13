import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { BundleTable } from '../components/Table/BundleTable';
import { useNavigate, useParams } from 'react-router-dom';
import SettingsModal from '../components/SettingsModal';
import Modal from '../components/Modal';
import { usePersistedSettings } from '../hooks/usePersistedSettings';
import { PDFExport } from '@progress/kendo-react-pdf';
import '@progress/kendo-theme-default/dist/all.css';
import '@progress/kendo-font-icons/dist/index.css';
import { useCurrentUser } from '../api/users';
import { deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  getExportFilename,
  handleExportSetup,
  handleExportCleanup,
  exportToA4PDF,
  exportToPDFV2
} from '../utils/pdfExport';

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ show, onClose, onConfirm, configurationName }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Smazat konfiguraci</h3>
        <p className="text-sm text-gray-500 mb-4">
          Opravdu chcete smazat konfiguraci "{configurationName}"? Tato akce je nevratná.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Zrušit
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Smazat
          </button>
        </div>
      </div>
    </div>
  );
};

// Bundle Picker Component - made more compact
const ConfigurationsPicker = ({ 
  configurations, 
  users, 
  selectedConfiguration, 
  onConfigurationSelect, 
  onDeleteConfiguration,
  refetchData,
  setError,
  updateConfiguration 
}) => {
  const { user } = useCurrentUser();
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [configToDelete, setConfigToDelete] = useState(null);
  const [configToEdit, setConfigToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    customer: '',
    isPrivate: false
  });
  
  // For non-customer users, allow additional filtering by customer
  const displayedConfigurations = useMemo(() => {
    if (user?.role === 'customer' || selectedCustomer === 'all') {
      return configurations;
    }
    return configurations.filter(config => config.customer === selectedCustomer);
  }, [configurations, selectedCustomer, user?.role]);

  const customerUsers = useMemo(() => {
    return users.filter(user => user.role === 'customer');
  }, [users]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    // Handle Firebase Timestamp object
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleString('cs-CZ', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteClick = (e, configuration) => {
    e.stopPropagation(); // Prevent card selection when clicking delete
    setConfigToDelete(configuration);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (configToDelete) {
      await onDeleteConfiguration(configToDelete.id);
      setShowDeleteModal(false);
      setConfigToDelete(null);
    }
  };

  const handleEditClick = (e, configuration) => {
    e.stopPropagation(); // Prevent card selection when clicking edit
    setConfigToEdit(configuration);
    setEditForm({
      name: configuration.name,
      customer: configuration.customer,
      isPrivate: configuration.isPrivate || false
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!configToEdit) return;

    try {
      await updateConfiguration(configToEdit.id, {
        name: editForm.name,
        customerId: editForm.customer,
        isPrivate: editForm.isPrivate
      });
      setShowEditModal(false);
      setConfigToEdit(null);
    } catch (error) {
      console.error('Error updating configuration:', error);
      setError('Failed to update configuration');
    }
  };

  return (
    <div className="px-8 py-4 bg-white border-b">
      {user?.role !== 'customer' && (
        <div className="mb-4">
          <select 
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="block w-48 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Všichni zákazníci</option>
            {customerUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username || user.email || 'Unknown'}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {displayedConfigurations.length > 0 ? (
        <div className="flex space-x-2 overflow-x-auto">
          {displayedConfigurations.map((configuration) => (
            <div
              key={configuration.id}
              onClick={() => onConfigurationSelect(configuration)}
              className={`p-3 rounded-lg cursor-pointer border min-w-[180px] relative group ${
                selectedConfiguration?.id === configuration.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {/* Action buttons - only show for non-customer users */}
              {user?.role !== 'customer' && (
                <div className={`absolute top-2 right-2 flex gap-2 transition-opacity z-10 ${
                  selectedConfiguration?.id === configuration.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <button
                    onClick={(e) => handleEditClick(e, configuration)}
                    className="p-1 text-gray-400 hover:text-[#e1007b] transition-colors bg-white rounded-full shadow-sm"
                    title="Upravit konfiguraci"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(e, configuration)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full shadow-sm"
                    title="Smazat konfiguraci"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="pr-16">
                <div className="font-medium text-sm flex items-center gap-2">
                  {configuration.isPrivate && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-[#e1007b]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="truncate">{configuration.name}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 truncate">
                 {users.find(user => user.id === configuration.customer)?.username || 'Unknown customer'}
                </div>
                <div className="mt-1 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {formatDate(configuration.createdAt)}
                  </span>
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                    {configuration.currency || 'CZK'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-left py-4">
          <p className="text-gray-500 text-sm mb-2">Žádná konfigurace nenalezena</p>
          <button
            onClick={() => navigate('/configurator')}
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded"
          >
            Vytvořit novou konfiguraci
          </button>
        </div>
      )}

      <DeleteConfirmationModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setConfigToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        configurationName={configToDelete?.name}
      />

      {showEditModal && (
        <Modal onClose={() => {
          setShowEditModal(false);
          setConfigToEdit(null);
        }}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Upravit konfiguraci</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Název konfigurace</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Zákazník</label>
                <select
                  value={editForm.customer}
                  onChange={(e) => setEditForm(prev => ({ ...prev, customer: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Vyber zákazníka</option>
                  {customerUsers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.username || customer.email || 'Unknown'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsPrivate"
                  checked={editForm.isPrivate}
                  onChange={(e) => setEditForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="editIsPrivate" className="ml-2 block text-sm text-gray-900">
                  Soukromá konfigurace
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setConfigToEdit(null);
                  }}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                  Zrušit
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-[#e1007b] text-white rounded hover:bg-[#c4006c]"
                >
                  Uložit změny
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Visitor View Component
const VisitorView = ({ configuration, processedItems, packages }) => {
  const [amounts, setAmounts] = useState({});

  useEffect(() => {
    if (configuration?.items) {
      const configAmounts = {
        amounts: {},
        discount: {},
        fixace: {}
      };
      Object.entries(configuration.items).forEach(([itemId, itemData]) => {
        configAmounts.amounts[itemId] = itemData.amount || 0;
        configAmounts.fixace[itemId] = itemData.fixace || 0;
        if (itemData.discount) configAmounts.discount[itemId] = itemData.discount;
        if (itemData.subItemDiscounts) {
          if (itemData.subItemDiscounts.fixace) {
            configAmounts.discount[`${itemId}_fixed_items`] = itemData.subItemDiscounts.fixace;
          }
          if (itemData.subItemDiscounts.over) {
            configAmounts.discount[`${itemId}_over_fixation_items`] = itemData.subItemDiscounts.over;
          }
        }
      });
      setAmounts(configAmounts);
    }
  }, [configuration]);

  if (!configuration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Konfigurace nenalezena</h1>
          <p className="text-gray-600">Požadovaná konfigurace neexistuje nebo k ní nemáte přístup.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{configuration.name}</h1>
          <div className="overflow-x-auto">
            <BundleTable
              bundles={packages}
              items={processedItems}
              amounts={amounts}
              readonly={true}
              showFixace={false}
              showIndividualDiscount={false}
              selectedConfiguration={configuration}
              enableRowSelection={false}
              selectedRows={{}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
function ViewOffersPage() {
  const { id } = useParams();
  const { 
    configurations, 
    loading: configLoading, 
    error, 
    processedItems, 
    packages, 
    users,
    loadItemsForCurrency,
    setProcessedItems,
    setError,
    refetchData,
    updateConfiguration
  } = useConfigData();
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [selectedConfiguration, setSelectedConfiguration] = useState(null);
  const [amounts, setAmounts] = useState({});
  const [currentCurrency, setCurrentCurrency] = useState('CZK');
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const navigate = useNavigate();
  const printRef = useRef(null);
  const tableRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showIndividualDiscount, setShowIndividualDiscount] = usePersistedSettings('showIndividualDiscount', false);
  const [showFixace, setShowFixace] = usePersistedSettings('showFixace', false);
  const [enableRowSelection, setEnableRowSelection] = usePersistedSettings('enableRowSelection', false);
  const [selectedRows, setSelectedRows] = useState({});
  const pdfExportComponent = useRef(null);
  const [deleteError, setDeleteError] = useState(null);
  const [preselectSettings, setPreselectSettings] = useState({
    preselectNonZeroPrices: false,
    selectedBundles: {}
  });

  // Filter configurations based on current user
  const filteredConfigurations = useMemo(() => {
    if (!user || !configurations) return [];
    
    // Filter configurations based on user role
    let filtered = [];
    if (user.role === 'customer') {
      // For customers, only show configurations where:
      // 1. They are the customer
      // 2. The configuration is not private
      filtered = configurations.filter(config => 
        config.customer === user.id && !config.isPrivate
      );
    } else if (user.role === 'admin') {
      // Admin sees all configurations
      filtered = configurations;
    } else {
      // Other roles (like sales) see configurations they created
      filtered = configurations.filter(config => config.createdBy === user.id);
    }
    
    // Sort by createdAt in descending order (newest first)
    return filtered.sort((a, b) => {
      const dateA = a.createdAt?.seconds || 0;
      const dateB = b.createdAt?.seconds || 0;
      return dateB - dateA;
    });
  }, [configurations, user]);

  // Effect to handle URL parameter and load correct items for currency
  useEffect(() => {
    if (id && configurations && !selectedConfiguration) {
      const config = configurations.find(c => c.id === id);
      if (config) {
        handleConfigurationSelect(config);
      }
    }
  }, [id, configurations, selectedConfiguration]);

  // Function to handle configuration selection and load correct items
  const handleConfigurationSelect = async (config) => {
    try {
      const currency = config.currency || 'CZK';
      let newItems = processedItems;
      
      // Only load new items if currency changed
      if (currency !== currentCurrency) {
        newItems = await loadItemsForCurrency(currency);
      }

      // Prepare amounts data
      const configAmounts = {
        amounts: {},
        discount: {},
        fixace: {}
      };

      // Process configuration items
      if (config.items) {
        Object.entries(config.items).forEach(([itemId, itemData]) => {
          configAmounts.amounts[itemId] = itemData.amount || 0;
          configAmounts.fixace[itemId] = itemData.fixace || 0;
          if (itemData.discount) configAmounts.discount[itemId] = itemData.discount;
          if (itemData.subItemDiscounts) {
            if (itemData.subItemDiscounts.fixace) {
              configAmounts.discount[`${itemId}_fixed_items`] = itemData.subItemDiscounts.fixace;
            }
            if (itemData.subItemDiscounts.over) {
              configAmounts.discount[`${itemId}_over_fixation_items`] = itemData.subItemDiscounts.over;
            }
          }
        });
      }

      // Batch all state updates
      if (currency !== currentCurrency) {
        setProcessedItems(newItems);
        setCurrentCurrency(currency);
      }
      setSelectedConfiguration(config);
      setGlobalDiscount(config.globalDiscount ?? 0);
      setAmounts(configAmounts);
    } catch (err) {
      setError(err.message);
    }
  };

  // Effect to update amounts when a configuration is selected
  useEffect(() => {
    if (selectedConfiguration && selectedConfiguration.items) {
      const configAmounts = {
        amounts: {},
        discount: {},
        fixace: {}
      };
      
      // Set global discount if present in configuration
      if (selectedConfiguration.globalDiscount !== undefined) {
        setGlobalDiscount(selectedConfiguration.globalDiscount);
      } else {
        setGlobalDiscount(0);
      }

      Object.entries(selectedConfiguration.items).forEach(([itemId, itemData]) => {
        configAmounts.amounts[itemId] = itemData.amount || 0;
        configAmounts.fixace[itemId] = itemData.fixace || 0;
        
        // Handle main item discount
        if (itemData.discount) configAmounts.discount[itemId] = itemData.discount;
        
        // Handle subitem discounts
        if (itemData.subItemDiscounts) {
          if (itemData.subItemDiscounts.fixace) {
            configAmounts.discount[`${itemId}_fixed_items`] = itemData.subItemDiscounts.fixace;
          }
          if (itemData.subItemDiscounts.over) {
            configAmounts.discount[`${itemId}_over_fixation_items`] = itemData.subItemDiscounts.over;
          }
        }
      });
      setAmounts(configAmounts);
    } else {
      setAmounts({
        amounts: {},
        discount: {},
        fixace: {}
      });
    }
  }, [selectedConfiguration]);

  // Show loading state
  if (configLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  // Show visitor view if there's an ID and no user
  if (id && !user) {
    return (
      <VisitorView 
        configuration={selectedConfiguration}
        processedItems={processedItems}
        packages={packages}
      />
    );
  }

  // Handle amount changes in the table
  const handleAmountChange = (itemId, amount, field = 'amounts') => {
    setAmounts(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [itemId]: amount
      }
    }));
  };

  // Handle print button click
  const handlePrintClick = () => {
    console.log('Debugging navigation state:', {
      packages,
      processedItems,
      amounts,
      selectedConfiguration
    });
    
    navigate('/print', {
      state: {
        packages,
        processedItems,
        amounts,
        selectedConfiguration,
        showFixace,
        showIndividualDiscount
      }
    });
  };

  // Handle row selection
  const handleRowSelect = (itemId, selected) => {
    setSelectedRows(prev => ({
      ...prev,
      [itemId]: selected
    }));
  };

  // Helper function to determine if an item should remain selected based on other criteria
  const shouldKeepSelected = (item, selectedBundles) => {
    // Check if item should be selected due to non-zero amounts
    if (preselectSettings.preselectNonZeroPrices) {
      const hasNonZeroAmount = (amounts.amounts[item.id] || 0) > 0 || (amounts.fixace[item.id] || 0) > 0;
      if (hasNonZeroAmount) return true;
    }
    
    // Check if item should be selected due to being free in any selected bundle
    for (const [bundleId, isSelected] of Object.entries(selectedBundles)) {
      if (isSelected) {
        const bundlePackage = item.packages?.find(pkg => pkg.packageId === bundleId);
        if (bundlePackage && bundlePackage.selected && bundlePackage.price === 0) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Handle setting change
  const handleSettingChange = (setting, value) => {
    if (setting === 'showIndividualDiscount') {
      setShowIndividualDiscount(value);
    } else if (setting === 'showFixace') {
      setShowFixace(value);
    } else if (setting === 'enableRowSelection') {
      setEnableRowSelection(value);
      if (!value) {
        setSelectedRows({});
        setPreselectSettings({
          preselectNonZeroPrices: false,
          selectedBundles: {}
        });
      }
    } else if (setting === 'preselectNonZeroPrices') {
      const newSelectedRows = { ...selectedRows };
      const processAllItems = (items) => {
        items.forEach(item => {
          if (item.type === 'item') {
            const hasNonZeroAmount = (amounts.amounts[item.id] || 0) > 0 || (amounts.fixace[item.id] || 0) > 0;
            if (hasNonZeroAmount) {
              newSelectedRows[item.id] = true;
            }
          }
          if (item.children && item.children.length > 0) {
            processAllItems(item.children);
          }
        });
      };
      
      processAllItems(processedItems);
      setSelectedRows(newSelectedRows);
      
    } else if (setting === 'preselectFreeItems') {
      const { bundleId, checked } = value;
      console.log('Bundle selection changed:', { bundleId, checked });
      
      // Update preselect settings
      const newPreselectSettings = {
        ...preselectSettings,
        selectedBundles: {
          ...preselectSettings.selectedBundles,
          [bundleId]: checked
        }
      };
      console.log('New preselect settings:', newPreselectSettings);
      setPreselectSettings(newPreselectSettings);

      // Create a new selection state starting from current selections
      const newSelectedRows = { ...selectedRows };

      const processAllItems = (items) => {
        items.forEach(item => {
          if (item.type === 'item') {
            let shouldBeSelected = false;

            // Check if item has non-zero amounts (if that setting is enabled)
            if (newPreselectSettings.preselectNonZeroPrices) {
              const hasNonZeroAmount = (amounts.amounts[item.id] || 0) > 0 || (amounts.fixace[item.id] || 0) > 0;
              if (hasNonZeroAmount) {
                shouldBeSelected = true;
                console.log(`Item ${item.id} selected due to non-zero amount`);
              }
            }

            // Check if item is free in any currently selected bundle
            const selectedBundleIds = Object.entries(newPreselectSettings.selectedBundles)
              .filter(([_, isSelected]) => isSelected)
              .map(([id]) => id);

            console.log('Selected bundle IDs:', selectedBundleIds);

            if (selectedBundleIds.length > 0) {
              console.log(`Checking item ${item.id}:`, item);
              
              // First check if this item is free in the bundle being toggled
              if (checked) {
                const bundlePackage = item.packages?.find(pkg => pkg.packageId === bundleId);
                const isFreeInCurrentBundle = bundlePackage && bundlePackage.selected && bundlePackage.price === 0;
                if (isFreeInCurrentBundle) {
                  shouldBeSelected = true;
                  console.log(`Item ${item.id} is free in newly selected bundle ${bundleId}`);
                }
              } else {
                // If unchecking a bundle, we need to check if the item is still free in any other selected bundle
                const isFreeInOtherBundle = selectedBundleIds.some(selectedBundleId => {
                  if (selectedBundleId === bundleId) return false; // Skip the bundle being unchecked
                  const bundlePackage = item.packages?.find(pkg => pkg.packageId === selectedBundleId);
                  const isFree = bundlePackage && bundlePackage.selected && bundlePackage.price === 0;
                  if (isFree) {
                    console.log(`Item ${item.id} is still free in bundle ${selectedBundleId}`);
                  }
                  return isFree;
                });
                
                if (isFreeInOtherBundle) {
                  shouldBeSelected = true;
                }
              }
            }

            // Update selection state
            if (checked) {
              // When checking a bundle, only add selections
              if (shouldBeSelected) {
                newSelectedRows[item.id] = true;
                console.log(`Selected item ${item.id}`);
              }
            } else {
              // When unchecking a bundle, remove selections only if item is not free in any other bundle
              if (!shouldBeSelected) {
                delete newSelectedRows[item.id];
                console.log(`Unselected item ${item.id}`);
              }
            }
          }

          if (item.children && item.children.length > 0) {
            processAllItems(item.children);
          }
        });
      };

      processAllItems(processedItems);
      console.log('Final selected rows:', newSelectedRows);
      setSelectedRows(newSelectedRows);
    }
  };

  // Handle export to PDF
  const handleExportToPDFV2 = async () => {
    if (!pdfExportComponent.current) return;

    try {
      setExporting(true);
      setExportStatus('Preparing document...');
      
      exportToPDFV2(pdfExportComponent, printRef, showFixace, amounts, enableRowSelection, selectedRows);

    } catch (error) {
      console.error('Error in handleExportToPDFV2:', error);
      setExportStatus(`Error: ${error.message}`);
    } finally {
      setExporting(false);
      setExportStatus('');
    }
  };

  const handleDeleteConfiguration = async (configId) => {
    try {
      await deleteDoc(doc(db, 'configurations', configId));
      // If the deleted configuration was selected, clear the selection
      if (selectedConfiguration?.id === configId) {
        setSelectedConfiguration(null);
      }
      // Refetch the configurations list
      await refetchData();
    } catch (err) {
      console.error('Error deleting configuration:', err);
      setDeleteError('Failed to delete configuration. Please try again.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-none bg-white shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedConfiguration ? (
                  <div className="flex flex-col">
                    <span>Náhled konfigurací</span>
                    <span className="text-lg font-normal text-gray-600 mt-1">
                      {selectedConfiguration.name}
                    </span>
                  </div>
                ) : (
                  'Náhled konfigurací'
                )}
              </h1>
              <div className="flex justify-between items-center space-x-4">
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={handleExportToPDFV2}
                  disabled={exporting}
                  className={`relative px-4 py-2 rounded text-white ${
                    exporting 
                      ? 'opacity-75 cursor-not-allowed bg-[#e1007b]' 
                      : 'bg-[#e1007b] hover:bg-[#c4006c]'
                  }`}
                >
                  {exporting ? (
                    <>
                      <span className="opacity-0">Export do PDF</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-sm">{exportStatus || 'Exporting...'}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    'Export do PDF'
                  )}
                </button>
              </div>
            </div>
            {(error || userError || deleteError) && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error || userError || deleteError}
              </div>
            )}
          </div>
        </header>
        
        <div className="flex-1 flex flex-col min-h-0">
          <ConfigurationsPicker 
            configurations={filteredConfigurations}
            users={users}
            selectedConfiguration={selectedConfiguration}
            onConfigurationSelect={handleConfigurationSelect}
            onDeleteConfiguration={handleDeleteConfiguration}
            refetchData={refetchData}
            setError={setError}
            updateConfiguration={updateConfiguration}
          />
          
          <div className="flex-1 overflow-auto">
            <PDFExport 
              ref={pdfExportComponent}
              paperSize="A4"
              margin={{ top: "0.5cm", left: "0cm", right: "0cm", bottom: "0cm" }}
              fileName={getExportFilename(selectedConfiguration, 'pdf')}
              author="ABRA Bundle Configurator"
              creator="ABRA Bundle Configurator"
              scale={0.53}
              forcePageBreak=".page-break"
              repeatHeaders={true}
              keepTogether=".keep-together"
              encoding="utf-8"
              producer="ABRA Bundle Configurator"
              title={selectedConfiguration?.name || 'Bundle Configuration'}
              keywords="ABRA,bundle,configuration"
              subject="Bundle Configuration Export"
            >
              <div 
                className="px-6 bg-white flex flex-col" 
                ref={printRef} 
                data-table-container
                style={{ 
                  width: '100%',
                  maxWidth: '100%',
                  fontFamily: '"DejaVu Sans", sans-serif'
                }}
              >
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <div>
                  <BundleTable
                    bundles={packages}
                    items={processedItems}
                    onAmountChange={handleAmountChange}
                    amounts={amounts}
                    readonly={true}
                    ref={tableRef}
                    exporting={exporting}
                    showFixace={showFixace}
                    showIndividualDiscount={showIndividualDiscount}
                    selectedConfiguration={selectedConfiguration}
                    enableRowSelection={enableRowSelection}
                    selectedRows={selectedRows}
                    onRowSelect={handleRowSelect}
                    className={exporting ? 'print-scale' : ''}
                    currency={currentCurrency}
                    globalDiscount={globalDiscount}
                  />
                </div>
              </div>
            </PDFExport>
          </div>
        </div>

        <SettingsModal
          show={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          settings={{ 
            showIndividualDiscount,
            showFixace,
            enableRowSelection,
            bundles: packages,
            ...preselectSettings
          }}
          onSettingChange={handleSettingChange}
        />
      </div>
    </div>
  );
}

export default ViewOffersPage; 

