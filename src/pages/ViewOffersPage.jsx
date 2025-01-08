import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { BundleTable } from '../components/Table/BundleTable';
import { useNavigate, useParams } from 'react-router-dom';
import SettingsModal from '../components/SettingsModal';
import { usePersistedSettings } from '../hooks/usePersistedSettings';
import { PDFExport } from '@progress/kendo-react-pdf';
import '@progress/kendo-theme-default/dist/all.css';
import '@progress/kendo-font-icons/dist/index.css';
import { useCurrentUser } from '../api/users';
import { deleteDoc, doc } from 'firebase/firestore';
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
const ConfigurationsPicker = ({ configurations, users, selectedConfiguration, onConfigurationSelect, onDeleteConfiguration }) => {
  const { user } = useCurrentUser();
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [configToDelete, setConfigToDelete] = useState(null);
  
  const filteredConfigurations = useMemo(() => {
    if (user?.role === 'customer') return configurations;
    if (selectedCustomer === 'all') return configurations;
    return configurations.filter(config => config.customer === selectedCustomer);
  }, [configurations, selectedCustomer, user]);

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
      
      {filteredConfigurations.length > 0 ? (
        <div className="flex space-x-2 overflow-x-auto">
          {filteredConfigurations.map((configuration) => (
            <div
              key={configuration.id}
              onClick={() => onConfigurationSelect(configuration)}
              className={`p-3 rounded-lg cursor-pointer border min-w-[180px] relative group ${
                selectedConfiguration?.id === configuration.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-sm">
                {configuration.name}
              </div>
              <div className="text-xs text-gray-500 mt-1">
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
              {/* Delete button */}
              <button
                onClick={(e) => handleDeleteClick(e, configuration)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Smazat konfiguraci"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
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
    refetchData
  } = useConfigData();
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [selectedConfiguration, setSelectedConfiguration] = useState(null);
  const [amounts, setAmounts] = useState({});
  const [currentCurrency, setCurrentCurrency] = useState('CZK');
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

  // Filter configurations based on current user
  const filteredConfigurations = useMemo(() => {
    if (!user || !configurations) return [];
    
    // For customers, show only configurations made for them
    if (user.role === 'customer') {
      return configurations.filter(config => config.customer === user.id);
    }
    
    // For other roles (admin, etc), show configurations they created
    return configurations.filter(config => config.createdBy === user.id);
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
      // Load items for the configuration's currency
      const currency = config.currency || 'CZK';
      if (currency !== currentCurrency) {
        const items = await loadItemsForCurrency(currency);
        setProcessedItems(items);
        setCurrentCurrency(currency);
      }
      setSelectedConfiguration(config);
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
      }
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
                Náhled konfigurací
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
                    'Export to PDF'
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
            enableRowSelection
          }}
          onSettingChange={handleSettingChange}
        />
      </div>
    </div>
  );
}

export default ViewOffersPage; 

