import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFDocument } from './PDFDocument';
import { PDFViewer } from '@react-pdf/renderer';
export const PDFGenerator = ({ packages, items, amounts, currentConfig }) => {
    console.log(packages, items, amounts, currentConfig);
  return (
    <div>
      <PDFViewer style={{ width: '100%', height: '600px' }}>
        <PDFDocument packages={packages} items={items} amounts={amounts} currentConfig={currentConfig} />
      </PDFViewer>  
      {/* <PDFDownloadLink
        document={<PDFDocument data={data} />}
        fileName="configuration.pdf"
        className="bg-abraMagenta hover:bg-abraMagenta-hover text-white font-bold py-2 px-4 rounded"
      >
        {({ blob, url, loading, error }) =>
          loading ? 'Generating PDF...' : 'Download PDF'
        }
      </PDFDownloadLink> */}
    </div>
  );
};