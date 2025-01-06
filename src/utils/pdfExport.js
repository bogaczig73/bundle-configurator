import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const getExportFilename = (configuration, extension) => {
  return configuration 
    ? `offer-${configuration.name}.${extension}`
    : `offer-${new Date().toISOString()}.${extension}`;
};

export const generateCanvas = async (printRef) => {
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

export const handleExportSetup = async (printRef, showFixace, amounts, enableRowSelection, selectedRows) => {
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

export const handleExportCleanup = (printRef, showFixace, amounts, enableRowSelection, selectedRows) => {
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

export const exportToA4PDF = async (printRef, selectedConfiguration, setExportStatus) => {
  if (!printRef.current) return;

  try {
    setExportStatus('Generating canvas...');
    const canvas = await generateCanvas(printRef);
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
    pdf.save(getExportFilename(selectedConfiguration, 'pdf'));

  } catch (error) {
    console.error('Error generating PDF:', error);
    setExportStatus(`Error: ${error.message}`);
    throw error;
  }
};

export const exportToPDFV2 = (pdfExportComponent, printRef, showFixace, amounts) => {
  if (!pdfExportComponent.current) return;
  
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

    // Expand all carousels if fixace is enabled
    if (showFixace) {
      const tableRows = container.querySelectorAll('[data-accordion-row="true"]');
      tableRows.forEach(row => {
        const itemId = row.getAttribute('data-item-id');
        console.log(amounts);
        if (amounts.amounts[itemId] > 0) {
          row.click(); // Trigger click to expand
        }
      });
    }

    // Add delay before export to allow carousels to expand
    setTimeout(() => {
      pdfExportComponent.current.save();

      // Restore original fonts
      container.style.fontFamily = originalFontFamily;
      cells.forEach(cell => {
        cell.style.fontFamily = originalCellFonts.get(cell);
      });

      // Collapse carousels back if they were expanded
      if (showFixace) {
        const tableRows = container.querySelectorAll('[data-accordion-row="true"]');
        tableRows.forEach(row => {
          const itemId = row.getAttribute('data-item-id');
          if (amounts.amounts[itemId] > 0) {
            row.click(); // Trigger click to collapse
          }
        });
      }
    }, 300); // 300ms delay
  } catch (error) {
    console.error('Error in exportToPDFV2:', error);
    throw error;
  }
}; 