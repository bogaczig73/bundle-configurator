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

 // Update this function to check if bundle should be active based on userLimit range
 export const isBundleActive = (bundle, index, amounts, bundles) => {
  const userAmount = amounts[1] || 0; // Check amount for item with id=1
  
  // Get the previous bundle's limit (or 0 if it's the first bundle)
  const previousLimit = index > 0 ? bundles[index - 1].userLimit : 0;
  
  // Bundle is active if user amount is greater than previous limit and less than or equal to current limit
  return userAmount > previousLimit && userAmount <= bundle.userLimit;
};


// Add this helper function near other bundle-related functions
export const isBundleDisabled = (bundle, index, amounts) => {
  const userAmount = amounts[1] || 0;
  console.log('userAmount', amounts);
  console.log('bundle.userLimit', bundle.userLimit);
  return userAmount > bundle.userLimit;
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
  const roundedPrice = Math.ceil(price);
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedPrice);
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
      const discount = amounts?.discount?.[item.id.toString()] ?? item.discount ?? 0;
      const fixaceDiscount = amounts?.discount?.[`${item.id}_fixed_items`] ?? item.discount ?? 0;
      const overDiscount = amounts?.discount?.[`${item.id}_over_fixation_items`] ?? item.discount ?? 0;
      const basePrice = item.getPrice(bundle.id);

      let itemTotal = 0;
      if (amounts.fixace) {
        // Calculate price for fixed items with its own discount
        const fixedPrice = basePrice * fixaceAmount * (1 - fixaceDiscount / 100);

        // Calculate price for items over fixace with its own discount
        const overFixaceAmount = Math.max(0, amount - fixaceAmount - item.getDiscount(bundle.id));
        const overFixacePrice = basePrice * overFixaceAmount * (1 - overDiscount / 100);

        itemTotal = (fixedPrice + overFixacePrice) * (1 - discount / 100);
      } else {
        // Non-fixace case
        const discountedAmount = Math.max(0, amount - item.getDiscount(bundle.id));
        itemTotal = basePrice * discountedAmount * (1 - discount / 100);
      }
      
      console.log('Item calculation result:', {
        id: item.id,
        name: item.name,
        amount,
        fixaceAmount,
        discount,
        fixaceDiscount,
        overDiscount,
        basePrice,
        itemTotal
      });
      
      return total + itemTotal;
    }, 0);

  console.log('Bundle total:', total);
  return total;
};