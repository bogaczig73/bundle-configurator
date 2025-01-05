import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { BundleTable } from '../components/Table/BundleTable';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import SettingsModal from '../components/SettingsModal';
import { usePersistedSettings } from '../hooks/usePersistedSettings';
import { PDFExport } from '@progress/kendo-react-pdf';
import { saveAs } from '@progress/kendo-file-saver';
import '@progress/kendo-theme-default/dist/all.css';
import '@progress/kendo-font-icons/dist/index.css';

import { useCurrentUser } from '../api/users';

// Bundle Picker Component - made more compact
const ConfigurationsPicker = ({ configurations, users, selectedConfiguration, onConfigurationSelect }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const navigate = useNavigate();
  
  const filteredConfigurations = useMemo(() => {
    if (selectedCustomer === 'all') return configurations;
    return configurations.filter(config => config.customer === selectedCustomer);
  }, [configurations, selectedCustomer]);

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
                <span className="text-xs text-gray-500">
                  {formatDate(configuration.createdAt)}
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
  const tableRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showIndividualDiscount, setShowIndividualDiscount] = usePersistedSettings('showIndividualDiscount', false);
  const [showFixace, setShowFixace] = usePersistedSettings('showFixace', false);
  const [enableRowSelection, setEnableRowSelection] = usePersistedSettings('enableRowSelection', false);
  const [selectedRows, setSelectedRows] = useState({});
  const pdfExportComponent = useRef(null);

  // Filter configurations based on current user
  const filteredConfigurations = useMemo(() => {
    if (!user || !configurations) return [];
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
      console.log('configAmounts', configAmounts);
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

  // Helper function for export setup and cleanup
  const handleExportSetup = async () => {
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
          let nextRow = row.nextElementSibling;
          const nextRows = [];
          
          while (nextRow && nextRow.getAttribute('data-category-row') !== 'true') {
            nextRows.push(nextRow);
            nextRow = nextRow.nextElementSibling;
          }

          const allHidden = nextRows.every(row => row.style.display === 'none');
          if (allHidden) {
            row.style.display = 'none';
          }
        }
      });
    }

    if (showFixace) {
      const tableRows = document.querySelectorAll('[data-accordion-row="true"]');
      tableRows.forEach(row => {
        const itemId = row.getAttribute('data-item-id');
        if (amounts.amounts[itemId] > 0) {
          row.click(); // Trigger click to expand
        }
      });
    }

    // Scale up the content for better quality
    if (printRef.current) {
      const table = printRef.current.querySelector('table');
      if (table) {
        // Store original styles
        const originalFontSize = window.getComputedStyle(table).fontSize;
        table.style.fontSize = '1.5em';
        
        // Scale up specific elements
        table.querySelectorAll('th, td').forEach(cell => {
          const originalPadding = window.getComputedStyle(cell).padding;
          cell.style.padding = '1em';
        });

        // Store cleanup function
        printRef.current.scaleCleanup = () => {
          table.style.fontSize = originalFontSize;
          table.querySelectorAll('th, td').forEach(cell => {
            cell.style.padding = '';
          });
        };
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const handleExportCleanup = () => {
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

    // Clean up scaling
    if (printRef.current && printRef.current.scaleCleanup) {
      printRef.current.scaleCleanup();
      delete printRef.current.scaleCleanup;
    }
  };

  const generateCanvas = async () => {
    if (!printRef.current) return null;

    try {
      // Ensure the element is fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = printRef.current;
      const table = element.querySelector('table');
      if (!table) return null;

      // Get the actual table dimensions
      const rect = table.getBoundingClientRect();
      const contentWidth = rect.width;

      // Store original display states and show all rows
      const rowStates = new Map();
      
      // Handle all row types
      const normalRows = table.querySelectorAll('tr:not([data-accordion-row]):not([data-category-row])');
      const accordionRows = table.querySelectorAll('[data-accordion-row="true"]');
      const categoryRows = table.querySelectorAll('[data-category-row="true"]');

      // Store and show normal rows
      normalRows.forEach(row => {
        rowStates.set(row, row.style.display);
        row.style.display = 'table-row';
      });

      // Store and show accordion rows
      accordionRows.forEach(row => {
        rowStates.set(row, row.style.display);
        row.style.display = 'table-row';
        // Find and show related content
        const itemId = row.getAttribute('data-item-id');
        if (itemId) {
          const relatedContent = element.querySelectorAll(`[data-parent-id="${itemId}"]`);
          relatedContent.forEach(content => {
            rowStates.set(content, content.style.display);
            content.style.display = 'table-row';
          });
        }
      });

      // Store and show category rows
      categoryRows.forEach(row => {
        rowStates.set(row, row.style.display);
        row.style.display = 'table-row';
      });

      // Force layout recalculation
      table.style.display = 'table';
      const contentHeight = table.scrollHeight;

      // Calculate offsets to center the content
      const offsetX = (element.offsetWidth - contentWidth) / 2;

      const canvas = await html2canvas(element, {
        scale: 6,
        width: contentWidth,
        height: contentHeight,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        x: offsetX,
        y: 0,
        scrollY: -window.scrollY,
        windowWidth: contentWidth,
        windowHeight: contentHeight,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.body.querySelector('[data-table-container]');
          if (clonedElement) {
            clonedElement.style.width = `${contentWidth}px`;
            clonedElement.style.height = `${contentHeight}px`;
            clonedElement.style.position = 'relative';
            clonedElement.style.transform = 'none';
            
            // Make sure all rows are visible in the clone
            const clonedTable = clonedElement.querySelector('table');
            if (clonedTable) {
              clonedTable.style.display = 'table';
              clonedTable.style.width = '100%';
              
              // Show all types of rows in the clone
              clonedTable.querySelectorAll('tr, [data-accordion-row="true"], [data-category-row="true"], [data-parent-id]').forEach(row => {
                row.style.display = 'table-row';
                row.style.visibility = 'visible';
                row.style.height = 'auto';
                row.style.opacity = '1';
              });
            }
          }
          return Promise.resolve();
        }
      });

      // Restore original display states
      rowStates.forEach((display, element) => {
        element.style.display = display;
      });

      return canvas;
    } catch (error) {
      console.error('Error generating canvas:', error);
      throw new Error('Failed to generate canvas');
    }
  };

  const getExportFilename = (extension) => {
    return selectedConfiguration 
      ? `offer-${selectedConfiguration.name}.${extension}`
      : `offer-${new Date().toISOString()}.${extension}`;
  };

  // Handle print to PDF
  const handlePrintToPDF = async () => {
    if (!printRef.current) return;

    try {
      setExporting(true);
      await handleExportSetup();
      
      const canvas = await generateCanvas();
      if (!canvas) return;

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
      pdf.save(getExportFilename('pdf'));

    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      handleExportCleanup();
      setExporting(false);
    }
  };

  // Handle print to PNG
  const handlePrintToPNG = async () => {
    if (!printRef.current) return;

    try {
      setExporting(true);
      await handleExportSetup();
      
      const canvas = await generateCanvas();
      if (!canvas) return;

      const data = canvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = data;
      link.download = getExportFilename('jpeg');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error generating PNG:', error);
    } finally {
      handleExportCleanup();
      setExporting(false);
    }
  };

  // Generate paginated A4 PDF
  const handlePrintToA4PDF = async () => {
    if (!printRef.current) return;

    try {
      setExporting(true);
      setExportStatus('Preparing document...');
      await handleExportSetup();

      setExportStatus('Generating canvas...');
      const canvas = await generateCanvas();
      if (!canvas) {
        throw new Error('Failed to generate canvas');
      }

      setExportStatus('Creating PDF...');
      // A4 dimensions in points (pt)
      const a4Width = 595.28;
      const a4Height = 841.89;
      const margins = 20;
      
      // Initialize PDF with A4 format
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        compress: false
      });

      // Calculate available space
      const availableWidth = a4Width - (margins * 2);
      const availableHeight = a4Height - (margins * 2);

      // Calculate scale while maintaining aspect ratio
      const originalAspectRatio = canvas.width / canvas.height;

      // Always fit to width for maximum size
      const finalWidth = availableWidth;
      const finalHeight = finalWidth / originalAspectRatio;
      const xOffset = margins;

      // Calculate scaling factors
      const scale = finalWidth / canvas.width;
      const totalHeight = canvas.height * scale;
      const pageCount = Math.ceil(totalHeight / availableHeight);
      const contentPerPage = canvas.height / pageCount;

      // For each page
      for (let i = 0; i < pageCount; i++) {
        setExportStatus(`Processing page ${i + 1} of ${pageCount}...`);
        if (i > 0) pdf.addPage();

        // Add page number
        pdf.setFontSize(8);
        pdf.setTextColor(128);
        pdf.text(`Page ${i + 1} of ${pageCount}`, a4Width - margins, a4Height - 10, { align: 'right' });

        try {
          // Calculate the portion of the canvas to show on this page
          const sourceY = i * contentPerPage;
          const remainingHeight = canvas.height - sourceY;
          const sourceHeight = Math.min(contentPerPage, remainingHeight);
          
          // Calculate the height this portion should take on the page
          const destHeight = (sourceHeight / canvas.height) * totalHeight;

          pdf.addImage(
            canvas,
            'PNG',
            xOffset,
            margins,
            finalWidth,
            destHeight,
            `page_${i}`,
            'FAST',
            0,
            -sourceY * scale
          );

        } catch (pageError) {
          console.error(`Error processing page ${i + 1}:`, pageError);
          throw new Error(`Failed to process page ${i + 1}`);
        }
      }

      setExportStatus('Saving PDF...');
      pdf.save(getExportFilename('pdf'));

    } catch (error) {
      console.error('Error generating PDF:', error);
      setExportStatus(`Error: ${error.message}`);
    } finally {
      handleExportCleanup();
      setExporting(false);
      setExportStatus('');
    }
  };

  const handleExportToPDFV2 = () => {
    if (pdfExportComponent.current) {
      setExporting(true);
      setExportStatus('Preparing PDF...');
      
      // Store original font family
      const container = printRef.current;
      const originalFontFamily = container.style.fontFamily;
      
      try {
        // Set DejaVu Sans font for export
        container.style.fontFamily = '"DejaVu Sans", sans-serif';
        
        // Apply font to all table cells
        const cells = container.querySelectorAll('td, th');
        const originalCellFonts = new Map();
        cells.forEach(cell => {
          originalCellFonts.set(cell, cell.style.fontFamily);
          cell.style.fontFamily = '"DejaVu Sans", sans-serif';
        });

        pdfExportComponent.current.save();

        // Restore original fonts
        container.style.fontFamily = originalFontFamily;
        cells.forEach(cell => {
          cell.style.fontFamily = originalCellFonts.get(cell);
        });
      } finally {
        setExporting(false);
        setExportStatus('');
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
                  onClick={handleExportToPDFV2}
                  disabled={exporting}
                  className={`px-4 py-2 rounded text-white ${
                    exporting 
                      ? 'opacity-75 cursor-not-allowed bg-purple-500' 
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  Export to PDF V2
                </button>
                <button
                  onClick={handlePrintToA4PDF}
                  disabled={exporting}
                  className={`relative px-4 py-2 rounded text-white ${
                    exporting 
                      ? 'opacity-75 cursor-not-allowed bg-[#e1007b]' 
                      : 'bg-[#e1007b] hover:bg-[#c4006c]'
                  }`}
                >
                  {exporting ? (
                    <>
                      <span className="opacity-0">Export as A4 PDF</span>
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
                    'Export as A4 PDF'
                  )}
                </button>
                <button
                  onClick={handlePrintToPDF}
                  disabled={exporting}
                  className={`px-4 py-2 rounded text-white ${
                    exporting 
                      ? 'opacity-75 cursor-not-allowed bg-[#e96b46]' 
                      : 'bg-[#e96b46] hover:bg-[#d15535]'
                  }`}
                >
                  Export as PDF
                </button>
                <button
                  onClick={handlePrintToPNG}
                  disabled={exporting}
                  className={`px-4 py-2 rounded text-white ${
                    exporting 
                      ? 'opacity-75 cursor-not-allowed bg-[#f6b200]' 
                      : 'bg-[#f6b200] hover:bg-[#e0a100]'
                  }`}
                >
                  Export as PNG
                </button>
                <button
                  onClick={handlePrintClick}
                  disabled={exporting}
                  className={`px-4 py-2 rounded text-white ${
                    exporting 
                      ? 'opacity-75 cursor-not-allowed bg-gray-400' 
                      : 'bg-gray-500 hover:bg-gray-600'
                  }`}
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
          
          <div className="flex-1 overflow-auto">
            <PDFExport 
              ref={pdfExportComponent}
              paperSize="A4"
              margin={{ top: "0.5cm", left: "0cm", right: "0cm", bottom: "0cm" }}
              fileName={getExportFilename('pdf')}
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

