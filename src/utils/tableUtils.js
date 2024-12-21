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
        const itemInstance = Item.create({
          ...item,
          uniqueId,
          depth: currentDepth,
          type: 'item'
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
        result.push({
          ...item,
          uniqueId,
          depth: currentDepth,
          type: 'item'
        });
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
  console.log('\nCalculating total for bundle:', bundle?.id);
  console.log('Items count:', items?.length);
  console.log('Amounts:', JSON.stringify(amounts, null, 2));

  if (!items || !Array.isArray(items)) {
    console.warn('No items provided or items is not an array');
    return 0;
  }

  // Check if bundle is active
  if (!bundle?.userLimit || bundle.userLimit <= 0) {
    console.log('Bundle is inactive:', bundle?.id);
    return 0;
  }

  const total = items
    .filter(item => {
      const isItem = item.type === 'item';
      console.log(`Filtering item ${item.id}: type=${item.type}, isItem=${isItem}`);
      return isItem;
    })
    .reduce((total, item) => {
      console.log('\nProcessing item:', item.id, item.name);
      
      // Use the Item class's calculateTotalPrice method if available
      if (item instanceof Item) {
        const itemTotal = item.calculateTotalPrice(
          bundle.id,
          amounts?.amounts || {},
          amounts?.discount || {}
        );
        console.log('Item total (using Item class):', itemTotal);
        return total + itemTotal;
      }
      
      // Fallback to manual calculation for non-Item instances
      const amount = amounts?.amounts?.[item.id] ?? 0;
      const basePrice = getItemPrice(item, bundle.id);
      const discountPercentage = amounts?.discount?.[item.id] ?? item.discount ?? 0;
      const discountMultiplier = 1 - (discountPercentage / 100);
      const itemTotal = basePrice * amount * discountMultiplier;
      
      console.log('Item total (manual calculation):', {
        amount,
        basePrice,
        discountPercentage,
        discountMultiplier,
        itemTotal
      });
      
      return total + itemTotal;
    }, 0);

  console.log('Final total for bundle:', bundle?.id, '=', total);
  return total;
};