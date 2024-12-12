export const abraColors = ['abraYellow', 'abraOrange', 'abraMagenta'];

export const getBundleBorderClasses = (index) => `
  border-l-2 border-r-2
  border-${abraColors[index % abraColors.length]}
  relative
  after:absolute after:content-[''] after:left-2 after:right-2 after:top-0 
  after:border-t after:border-dotted after:border-gray-200
`;

export const getBundleHeaderBorderClasses = (index) => `
  border-l-2 border-r-2 border-t-2
  border-${abraColors[index % abraColors.length]}
`;

export const useTableStyles = () => ({
  headerCell: "px-2 md:px-4 py-2 text-xs font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200",
  packageHeaderCell: "px-2 md:px-4 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider",
  bodyCell: "px-2 md:px-4 py-2",
  packageBodyCell: "px-2 md:px-4 py-2",
  checkbox: "h-4 w-4 size-4 rounded border-gray-400 focus:ring-offset-0",
  // ... rest of your styles
  
  columnWidths: {
    details: "w-48 min-w-[120px]",
    amount: "w-32",
    bundle: "w-32 px-[5px]",
  },
  
  container: "min-w-[800px]",
  tableWrapper: "overflow-y-auto max-h-[calc(100vh-200px)] bg-white scrollbar-hide",
  // ... rest of your styles
}); 