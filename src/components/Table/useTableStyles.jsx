export const abraColors = ['abraYellow', 'abraOrange', 'abraMagenta'];

export const getColorHex = (index) => {
  const colors = ['#f6b200', '#e96b46', '#e1007b'];
  return colors[index % colors.length];
};

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

export const useTableStyles = (exporting = false) => ({
    headerCell: "px-2 md:px-4 py-2 text-xs font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-200 bg-white",
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
      fixace: "w-32",
      bundle: "w-32 px-[5px]",
    },
    // New styles
    container: "min-w-[800px] inline-block w-full",
    tableWrapper: "bg-white scrollbar-hide",
    table: "w-full table-fixed",
    categoryRow: "border-b-2 border-b-abraMagenta",
    itemName: {
      category: "font-medium text-abraMagenta text-sm break-words",
      item: "text-xs text-gray-700 break-words font-bold opacity-90",
      itemDetail: "text-xs text-gray-700 break-words opacity-90",
      detail: "text-[10px] text-gray-500 break-words opacity-75"
    },
    itemNote: "text-xs text-gray-500 break-words",
    itemAmount: "text-sm text-gray-700 break-words",
    freeItemText: "text-xs font-medium text-gray-400",
    bundlePrice: "text-blue-600 font-semibold",
    priceText: "text-xs font-medium",
    priceNote: "text-xs text-gray-500",
    itemRow: "hover:bg-gray-50/70 transition-colors duration-150",
    activeBundle: "!text-white !font-bold",
    currencySelect: "block w-full rounded-md min-w-[150px] border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm",

    // Add new accordion-related styles
    accordionWrapper: "flex items-center gap-2 w-full",
    accordionIcon: "w-4 h-4 text-gray-500 transition-transform duration-200",
    accordionIconExpanded: "transform rotate-180",
    accordionContent: "flex flex-col flex-1",
    accordionName: "flex items-center justify-between w-full",

    getBundleHeaderBorderClasses,
    getBundleBorderClasses,

    // New styles for bundle values
    bundleValues: {
      wrapper: "flex flex-col items-center",
      mainValue: "text-xs font-medium text-gray-700",
      detail: "text-[10px] text-gray-500 mt-0.5",
      detailWrapper: "flex flex-col items-center opacity-75"
    },

    // Updated styles for detail rows
    detailRow: {
        wrapper: "flex flex-col items-center",
        mainValue: "text-xs font-medium text-gray-700",
        detail: "text-[10px] text-gray-500 mt-0.5",
        detailWrapper: "flex flex-col items-center opacity-75"
    },

    // Update amount and fixace display
    amountDisplay: {
        value: "text-xs text-gray-700",
        note: "text-[10px] text-gray-500 opacity-75"
    },

    // Add new styles for inactive bundles
    inactiveBundle: {
      header: "opacity-40 border-opacity-40 bg-gray-100",
      cell: "opacity-40 border-opacity-40 bg-gray-100",
      price: "text-gray-400"
    },
}); 