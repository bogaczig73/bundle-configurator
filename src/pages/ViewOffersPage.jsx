import React, { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from '../components/Sidebar';
import { useConfigData } from '../hooks/useConfigData';
import { BundleTable } from '../components/Table/BundleTable';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


import { useCurrentUser } from '../api/users';

// Bundle Picker Component - made more compact
const ConfigurationsPicker = ({ configurations, users, selectedConfiguration, onConfigurationSelect }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  
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
          <option value="all">All Customers</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username || user.email || 'Unknown'}
            </option>
          ))}
        </select>
      </div>
      
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
    
    navigate('/test2', {
      state: {
        packages,
        processedItems,
        amounts,
        selectedConfiguration
      }
    });
  };

  // Add this new function to handle PNG export
  const handlePrintToPNG = async () => {
    if (printRef.current) {
      try {
        setExporting(true);
        
        // Add a small delay to ensure the state update is reflected
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const element = printRef.current;
        const canvas = await html2canvas(element, {
          scale: 2, // Higher scale for better quality
          height: printRef.current.scrollHeight,
          width: 1920,
          logging: false,
          useCORS: true
        });

        // Create PNG file
        const data = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        
        // Create filename using configuration name or timestamp
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
        setExporting(false);
      }
    }
  };

  // Add this new function to handle PDF export
  const handlePrintToPDF = async () => {
    if (printRef.current) {
      try {
        setExporting(true);
        
        // Add a small delay to ensure the state update is reflected
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const element = printRef.current;
        const canvas = await html2canvas(element, {
          scale: 2, // Higher scale for better quality
          height: printRef.current.scrollHeight,
          width: 1920,
          logging: false,
          useCORS: true
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Create PDF
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [canvas.width, canvas.height]
        });

        // Calculate dimensions to fit the image properly
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

        // Create filename using configuration name or timestamp
        const filename = selectedConfiguration 
          ? `offer-${selectedConfiguration.name}.pdf`
          : `offer-${new Date().toISOString()}.pdf`;

        pdf.save(filename);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                My Offers
              </h1>
              <div className="space-x-4">
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
        
        {/* Add ref to the content you want to capture */}
        <div className="flex-1 overflow-hidden">
          <ConfigurationsPicker 
            configurations={filteredConfigurations}
            users={users}
            selectedConfiguration={selectedConfiguration}
            onConfigurationSelect={setSelectedConfiguration}
          />
          
          <div className="flex-1 px-8 pb-8 bg-white" ref={printRef}>
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
              readonly={true}
              ref={printRef}
              exporting={exporting}
              showFixace={true}
              showIndividualDiscount={true}
              selectedConfiguration={selectedConfiguration}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewOffersPage; 

