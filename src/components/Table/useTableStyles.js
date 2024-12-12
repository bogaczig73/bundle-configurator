export const abraColors = ['abraYellow', 'abraOrange', 'abraMagenta'];

const getBundleBorderClasses = (index) => `
  border-l-2 border-r-2
  border-${abraColors[index % abraColors.length]}
  relative
  after:absolute after:content-[''] after:left-2 after:right-2 after:top-0 
  after:border-t after:border-dotted after:border-gray-200
`;

const getBundleHeaderBorderClasses = (index) => `
  border-l-2 border-r-2 border-t-2
  border-${abraColors[index % abraColors.length]}
`;

export const useTableStyles = () => ({
    headerCell: "px-2 md:px-4 py-2 text-xs font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200",
    packageHeaderCell: "px-2 md:px-4 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider",
    bodyCell: "px-2 md:px-4 py-2",
    packageBodyCell: "px-2 md:px-4 py-2",
    checkbox: "h-4 w-4 size-4 rounded border-gray-400 focus:ring-offset-0",
    
    numberInput: "w-14 md:w-16 text-center w-full border-x-0 h-8 text-gray-900 text-sm border-gray-400 block w-full p-2",
    inputCounterButton: "hover:bg-gray-200 border border-gray-400 p-2.5 h-8 focus:ring-gray-100 focus:ring-2 focus:outline-none",
    counterButtonSymbols: "w-2 h-2 text-gray-400",
    
    centerWrapper: "flex justify-center items-center h-full",
    columnWidths: {
      details: "w-48 min-w-[120px]",
      amount: "w-32",
      bundle: "w-32 px-[5px]",
    },
    
    // New styles
    container: "min-w-[800px]",
    tableWrapper: "overflow-y-auto max-h-[calc(100vh-200px)] bg-white scrollbar-hide",
    categoryRow: "border-b-2 border-b-abraMagenta",
    itemName: {
      category: "font-medium text-abraMagenta text-sm break-words",
      item: "text-gray-700 text-sm break-words"
    },
    itemNote: "text-xs text-gray-500 break-words",
    freeItemText: "text-xs font-medium text-gray-400",
    bundlePrice: "text-blue-600 font-semibold",
    priceText: "text-xs font-medium",
    priceNote: "text-xs text-gray-500",
    itemRow: "hover:bg-gray-50/70 transition-colors duration-150",
    activeBundle: "!text-white !font-bold",

    getBundleHeaderBorderClasses,
    getBundleBorderClasses,
}); 