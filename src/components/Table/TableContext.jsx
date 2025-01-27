import React, { createContext, useContext } from 'react';

const TableContext = createContext(null);

export const TableProvider = ({ 
  bundles = [], 
  items = [], 
  amounts = {}, 
  onAmountChange,
  readonly = false,
  showIndividualDiscount = false,
  showFixace = false,
  enableRowSelection = false,
  selectedRows = {},
  onRowSelect,
  currency = 'CZK',
  userRole = 'customer',
  settings = {},
  children,
  isBundleDisabled
}) => {
  const value = {
    bundles,
    items,
    amounts,
    onAmountChange,
    readonly,
    showIndividualDiscount,
    showFixace,
    enableRowSelection,
    selectedRows,
    onRowSelect,
    currency,
    userRole,
    settings,
    isBundleDisabled
  };

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};