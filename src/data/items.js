import { defaultItemsEUR } from './items_eur';
import { defaultItemsUSD } from './items_usd';

// Default items with prices in CZK
export const defaultItemsCZK = [
  // ... existing items array ...
];

// Export default items based on currency
export const getDefaultItemsForCurrency = (currency) => {
  switch (currency.toUpperCase()) {
    case 'EUR':
      return defaultItemsEUR;
    case 'USD':
      return defaultItemsUSD;
    case 'CZK':
    default:
      return defaultItemsCZK;
  }
};

// For backward compatibility
export const defaultItems = defaultItemsCZK;