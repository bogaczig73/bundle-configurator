import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { BundleTable } from '../components/Table/BundleTable';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import SettingsModal from '../components/SettingsModal';
import { usePersistedSettings } from '../hooks/usePersistedSettings';

import { useCurrentUser } from '../api/users';

// Bundle Picker Component - made more compact
const ConfigurationsPicker = ({ configurations, users, selectedConfiguration, onConfigurationSelect }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const navigate = useNavigate();
  
  const filteredConfigurations = useMemo(() => {
    if (selectedCustomer === 'all') return configurations;
    return configurations.filter(config => config.customer === selectedCustomer);
  }, [configurations, selectedCustomer]);

  return (
    <div className="px-8 py-4 bg-white border-b">
      <div className="mb-4">
        <select 
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="block w-48 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Všichni zákazníci</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username || user.email || 'Unknown'}
            </option>
          ))}
        </select>
      </div>
      
      {filteredConfigurations.length > 0 ? (
        <div className="flex space-x-2 overflow-x-auto">
          {filteredConfigurations.map((configuration) => (
            <div
              key={configuration.id}
              onClick={() => onConfigurationSelect(configuration)}
              className={`p-3 rounded-lg cursor-pointer border min-w-[180px] ${
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
              <div className="mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  configuration.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {configuration.status || 'draft'}
                </span>
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
    </div>
  );
};


// Main Component
function ViewOffersPage() {
  const { configurations, loading: configLoading, error, processedItems, packages, users } = useConfigData();
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [selectedConfiguration, setSelectedConfiguration] = useState(null);
  const [amounts, setAmounts] = useState({});
  const navigate = useNavigate();
  const printRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showIndividualDiscount, setShowIndividualDiscount] = usePersistedSettings('showIndividualDiscount', false);
  const [showFixace, setShowFixace] = usePersistedSettings('showFixace', false);
  const [enableRowSelection, setEnableRowSelection] = usePersistedSettings('enableRowSelection', false);
  const [selectedRows, setSelectedRows] = useState({});

  // Filter configurations based on current user
  const filteredConfigurations = useMemo(() => {
    if (!user || !configurations) return [];
    console.log('configurations', configurations);
    console.log('Filtered configurations:', configurations.filter(config => config.createdBy === user.id));
    return configurations.filter(config => config.createdBy === user.id);
  }, [configurations, user]);

  // Add useEffect to update amounts when a configuration is selected
  useEffect(() => {
    if (selectedConfiguration && selectedConfiguration.items) {
      const configAmounts = {
        amounts: {},
        discount: {},
        fixace: {}
      };
      Object.entries(selectedConfiguration.items).forEach(([itemId, itemData]) => {
        configAmounts.amounts[itemId] = itemData.amount || 0;
        if (itemData.discount) configAmounts.discount[itemId] = itemData.discount;
        if (itemData.fixace) configAmounts.fixace[itemId] = itemData.fixace;
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

  // Modify print functions to respect row selection
  const handlePrintToPDF = async () => {
    if (printRef.current) {
      try {
        if (showFixace) {
          const tableRows = document.querySelectorAll('[data-accordion-row="true"]');
          tableRows.forEach(row => {
            const itemId = row.getAttribute('data-item-id');
            if (amounts.amounts[itemId] > 0) {
              row.click(); // Trigger click to expand
            }
          });
        }
        setExporting(true);

        // Hide unselected rows if row selection is enabled
        if (enableRowSelection && Object.keys(selectedRows).length > 0) {
          const tableRows = document.querySelectorAll('[data-accordion-row="true"], [data-category-row="true"]');
          
          // First pass: Hide unselected items
          tableRows.forEach(row => {
            const itemId = row.getAttribute('data-item-id');
            const isCategory = row.getAttribute('data-category-row') === 'true';
            
            if (!isCategory && !selectedRows[itemId]) {
              row.style.display = 'none';
            }
          });

          // Second pass: Hide categories with no visible items
          tableRows.forEach(row => {
            const isCategory = row.getAttribute('data-category-row') === 'true';
            if (isCategory) {
              const categoryId = row.getAttribute('data-category-id');
              const nextRows = [];
              let nextRow = row.nextElementSibling;
              
              // Collect all rows until next category
              while (nextRow && nextRow.getAttribute('data-category-row') !== 'true') {
                nextRows.push(nextRow);
                nextRow = nextRow.nextElementSibling;
              }

              // Check if all items in this category are hidden
              const allHidden = nextRows.every(row => row.style.display === 'none');
              if (allHidden) {
                row.style.display = 'none';
              }
            }
          });
        }

        await new Promise(resolve => setTimeout(resolve, 100));
        
        const element = printRef.current;
        const canvas = await html2canvas(element, {
          scale: 2.2,
          height: printRef.current.scrollHeight,
          width: 1920,
          logging: false,
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: true,
          x: -250,
          y: -270
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [canvas.width, canvas.height]
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

        const filename = selectedConfiguration 
          ? `offer-${selectedConfiguration.name}.pdf`
          : `offer-${new Date().toISOString()}.pdf`;

        pdf.save(filename);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        // Restore visibility of hidden rows
        if (enableRowSelection && Object.keys(selectedRows).length > 0) {
          const tableRows = document.querySelectorAll('[data-accordion-row="true"], [data-category-row="true"]');
          tableRows.forEach(row => {
            row.style.display = '';
          });
        }

        if (showFixace) {
          const tableRows = document.querySelectorAll('[data-accordion-row="true"]');
          tableRows.forEach(row => {
            const itemId = row.getAttribute('data-item-id');
            if (amounts.amounts[itemId] > 0) {
              row.click();
            }
          });
        }
        setExporting(false);
      }
    }
  };

  // Similar modification for PNG export
  const handlePrintToPNG = async () => {
    if (printRef.current) {
      try {
        setExporting(true);

        // Hide unselected rows if row selection is enabled
        if (enableRowSelection && Object.keys(selectedRows).length > 0) {
          const tableRows = document.querySelectorAll('[data-accordion-row="true"], [data-category-row="true"]');
          
          // First pass: Hide unselected items
          tableRows.forEach(row => {
            const itemId = row.getAttribute('data-item-id');
            const isCategory = row.getAttribute('data-category-row') === 'true';
            
            if (!isCategory && !selectedRows[itemId]) {
              row.style.display = 'none';
            }
          });

          // Second pass: Hide categories with no visible items
          tableRows.forEach(row => {
            const isCategory = row.getAttribute('data-category-row') === 'true';
            if (isCategory) {
              const categoryId = row.getAttribute('data-category-id');
              const nextRows = [];
              let nextRow = row.nextElementSibling;
              
              // Collect all rows until next category
              while (nextRow && nextRow.getAttribute('data-category-row') !== 'true') {
                nextRows.push(nextRow);
                nextRow = nextRow.nextElementSibling;
              }

              // Check if all items in this category are hidden
              const allHidden = nextRows.every(row => row.style.display === 'none');
              if (allHidden) {
                row.style.display = 'none';
              }
            }
          });
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const element = printRef.current;
        const canvas = await html2canvas(element, {
          scale: 2,
          height: printRef.current.scrollHeight,
          width: 1920,
          logging: false,
          useCORS: true,
          foreignObjectRendering: true,
          x: -250,
          y: -250
        });

        const data = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        
        const filename = selectedConfiguration 
          ? `offer-${selectedConfiguration.name}.jpeg`
          : `offer-${new Date().toISOString()}.jpeg`;

        link.href = data;
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error generating PNG:', error);
      } finally {
        // Restore visibility of hidden rows
        if (enableRowSelection && Object.keys(selectedRows).length > 0) {
          const tableRows = document.querySelectorAll('[data-accordion-row="true"], [data-category-row="true"]');
          tableRows.forEach(row => {
            row.style.display = '';
          });
        }
        setExporting(false);
      }
    }
  };

  // Show loading state if either data is loading
  if (configLoading || userLoading) {
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
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-none bg-white shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                My Offers
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
                  onClick={handlePrintToPDF}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Export as PDF
                </button>
                <button
                  onClick={handlePrintToPNG}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Export as PNG
                </button>
                <button
                  onClick={handlePrintClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Print
                </button>
              </div>
            </div>
            {(error || userError) && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error || userError}
              </div>
            )}
          </div>
        </header>
        
        <div className="flex-1 flex flex-col min-h-0">
          <ConfigurationsPicker 
            configurations={filteredConfigurations}
            users={users}
            selectedConfiguration={selectedConfiguration}
            onConfigurationSelect={setSelectedConfiguration}
          />
          
          <div className={`flex-1 ${!exporting ? 'overflow-auto' : ''} px-8 pb-8 bg-white flex flex-col`} ref={printRef}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <div className="flex-1">
              <BundleTable
                bundles={packages}
                items={processedItems}
                onAmountChange={handleAmountChange}
                amounts={amounts}
                readonly={true}
                ref={printRef}
                exporting={exporting}
                showFixace={showFixace}
                showIndividualDiscount={showIndividualDiscount}
                selectedConfiguration={selectedConfiguration}
                enableRowSelection={enableRowSelection}
                selectedRows={selectedRows}
                onRowSelect={handleRowSelect}
              />
            </div>
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

