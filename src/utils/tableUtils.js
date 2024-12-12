import { abraColors } from "../components/Table/useTableStyles";
import checkmarkIconBasic  from '../images/symbols/Klad_znamenko_Basic.svg';
import checkmarkIconStandard from '../images/symbols/Klad_znamenko_Standard.svg';
import checkmarkIconPremium from '../images/symbols/Klad_znamenko_Premium.svg';



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

export const getItemPrice = (item, bundleId) => {
  if (item.individual) return 1;
  if (!item.packages) return 0;
  const priceEntry = item.packages.find(p => p.packageId === bundleId);
  return priceEntry?.price ?? 0;
};


export const getItemDiscount = (item, bundleId) => {
  const priceEntry = item.packages.find(p => p.packageId === bundleId);
  return priceEntry?.discountedAmount ?? 0;
};


export const isFreeForAllBundles = (item) => {
  // Check if the item has prices array
  if (!item.packages) return false;
  
  // Check if all prices are 0 and the item is not individual
  return item.packages.every(price => price.price === 0) && !item.individual;
};

export const isBundleActive = (bundle, index, amounts, bundles) => {
  const userAmount = amounts[1] || 0; // Check amount for item with id=1
  
  // Get the previous bundle's limit (or 0 if it's the first bundle)
  const previousLimit = index > 0 ? bundles[index - 1].userLimit : 0;
  
  // Bundle is active if user amount is greater than previous limit and less than or equal to current limit
  return userAmount > previousLimit && userAmount <= bundle.userLimit;
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

export const getItemSelected = (item, bundleId) => {
    const selectionEntry = item.packages.find(p => p.packageId === bundleId);
    return selectionEntry?.selected ?? false;
  };