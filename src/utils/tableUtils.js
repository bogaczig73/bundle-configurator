import { abraColors } from "../components/Table/useTableStyles";
import checkmarkIconBasic  from '../images/symbols/Klad_znamenko_Basic.svg';
import checkmarkIconStandard from '../images/symbols/Klad_znamenko_Standard.svg';
import checkmarkIconPremium from '../images/symbols/Klad_znamenko_Premium.svg';
import { Item } from '../types/Item';

export { abraColors };

// New approach with Item instances
export const processItems = (items, depth = 0, parentId = '') => {
  const result = [];
  
  const process = (items, currentDepth = 0, currentParentId = '') => {
    if (!Array.isArray(items)) return;
    
    items.forEach((item, index) => {
      const uniqueId = currentParentId ? `${currentParentId}-${index}` : `${index}`;
      
      if (item.type === 'category') {
        // Keep categories as plain objects
        const category = {
          ...item,
          uniqueId,
          depth: currentDepth,
          type: 'category'
        };
        result.push(category);
        if (Array.isArray(item.children)) {
          process(item.children, currentDepth + 1, uniqueId);
        }
      } else {
        // Convert to Item instance if it isn't already
        const itemInstance = Item.create({
          ...item,
          uniqueId,
          depth: currentDepth,
          type: 'item' // Only set type 'item' for non-categories
        });
        result.push(itemInstance);
      }
    });
  };

  process(items, depth, parentId);
  return result;
};

// Legacy approach (keeping for backward compatibility)
export const flattenItems = (items, depth = 0, parentId = '') => {
  const result = [];
  
  const flatten = (items, currentDepth = 0, currentParentId = '') => {
    if (!Array.isArray(items)) return;
    
    items.forEach((item, index) => {
      const uniqueId = currentParentId ? `${currentParentId}-${index}` : `${index}`;
      
      if (item.type === 'category') {
        // Keep categories as plain objects
        result.push({
          ...item,
          uniqueId,
          depth: currentDepth,
          type: 'category'
        });
        if (Array.isArray(item.children)) {
          flatten(item.children, currentDepth + 1, uniqueId);
        }
      } else {
        // Convert to Item instance if it isn't already
        const itemInstance = item instanceof Item ? item : Item.create({
          ...item,
          uniqueId,
          depth: currentDepth,
          type: 'item' // Only set type 'item' for non-categories
        });
        result.push(itemInstance);
      }
    });
  };

  flatten(items, depth, parentId);
  return result;
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Legacy utility functions (keeping for backward compatibility)
export const getItemPrice = (item, bundleId) => {
  if (item instanceof Item) {
    return item.getPrice(bundleId);
  }
  if (item.individual) return 1;
  if (!item.packages) return 0;
  const priceEntry = item.packages.find(p => p.packageId === bundleId);
  return priceEntry?.price ?? 0;
};

export const getItemDiscount = (item, bundleId) => {
  if (item instanceof Item) {
    return item.getDiscount(bundleId);
  }
  const priceEntry = item.packages?.find(p => p.packageId === bundleId);
  return priceEntry?.discountedAmount ?? 0;
};

export const getItemSelected = (item, bundleId) => {
  if (item instanceof Item) {
    return item.isSelected(bundleId);
  }
  const selectionEntry = item.packages?.find(p => p.packageId === bundleId);
  return selectionEntry?.selected ?? false;
};

export const isFreeForAllBundles = (item) => {
  if (item instanceof Item) {
    return item.isFreeForAllBundles();
  }
  if (!item.packages) return false;
  return item.packages.every(price => price.price === 0) && !item.individual;
};

export const isBundleActive = (bundle, index, amounts, items) => {
  // A bundle is active if it has a userLimit greater than 0
  return bundle.userLimit > 0;
};

export const getColorClass = (index) => `text-${abraColors[index % abraColors.length]}`;

export const getCheckmarkIcon = (index) => {
  switch (index) {
    case 0:
      return checkmarkIconBasic;
    case 1:
      return checkmarkIconStandard;
    case 2:
      return checkmarkIconPremium;
    default:
      return checkmarkIconBasic;
  }
};

export const calculateBundleTotal = (bundle, items, amounts) => {
  console.log('\nCalculating total for bundle:', {
    bundleId: bundle?.id,
    bundleUserLimit: bundle?.userLimit,
    itemsCount: items?.length,
    amounts: amounts
  });

  if (!items || !Array.isArray(items)) {
    console.warn('No items provided or items is not an array');
    return 0;
  }

  // Check if bundle is active based on userLimit
  const userCount = amounts?.amounts?.[1] || 0;
  if (!bundle?.userLimit || userCount > bundle.userLimit) {
    console.log('Bundle is inactive:', {
      bundleId: bundle?.id,
      userCount,
      userLimit: bundle?.userLimit
    });
    return 0;
  }

  const total = items
    .filter(item => {
      // An item is valid if it's an Item instance and not a category
      const isValidItem = item instanceof Item && item.type !== 'category';
      console.log(`Filtering item ${item.id}:`, {
        type: item.type,
        isValidItem,
        isItemInstance: item instanceof Item
      });
      return isValidItem;
    })
    .reduce((total, item) => {
      // Update item's internal state
      const amount = amounts?.amounts?.[item.id.toString()] ?? 0;
      const fixaceAmount = amounts?.fixace?.[item.id.toString()] ?? 0;
      const fixaceDiscount = amounts?.discount?.['Fixované položky'] ?? item.discount ?? 0;
      const overDiscount = amounts?.discount?.['Položky nad rámec fixace'] ?? item.discount ?? 0;
      
      // Set the amounts and discounts
      item.setAmounts(amount, fixaceAmount);
      item.setDiscounts(fixaceDiscount, overDiscount);
      
      // Calculate total price using the item's method
      const itemTotal = item.calculateTotalPrice(bundle.id);
      console.log('Item calculation result:', {
        id: item.id,
        name: item.name,
        amount,
        fixaceAmount,
        fixaceDiscount,
        overDiscount,
        basePrice: item.getPrice(bundle.id),
        itemTotal
      });
      
      return total + itemTotal;
    }, 0);

  console.log('Bundle total:', total);
  return total;
};