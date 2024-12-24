import React from 'react';
import { useLocation } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { PDFDocument } from '../components/PDFDocument';

function PrintPage() {
  const location = useLocation();
  const { packages, processedItems, amounts, selectedConfiguration, showFixace, showIndividualDiscount } = location.state || {};

  if (!packages || !processedItems) {
    return <div>No data to display</div>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <PDFViewer style={{ width: '100%', height: '100%' }}>
        <PDFDocument
          packages={packages}
          items={processedItems}
          amounts={amounts}
          currentConfig={selectedConfiguration}
          showFixace={showFixace}
          showIndividualDiscount={showIndividualDiscount}
        />
      </PDFViewer>
    </div>
  );
}

export default PrintPage; 