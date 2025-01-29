import { Item } from '../types/Item';

export const isBundleActive = (bundle) => {
  return bundle.state === 'active';
};

export const isBundleInactive = (bundle) => {
  return bundle.state === 'inactive';
};

export const getBundleState = (bundle, index, amounts, items, packages) => {
  // If no amounts are set, keep all bundles in default state
  if (!Object.values(amounts?.amounts || {}).some(amount => amount > 0)) {
    return { state: 'default' };
  }
  // Check user limits first
  const nonSelectedItems = [];
  let isUserLimitState = 'default';
  const userAmount = amounts?.amounts?.[1] || 0;
  if (userAmount >= bundle.userLimit) {
    isUserLimitState = 'inactive';
    nonSelectedItems.push({
      name: "Počet uživatelů přesahuje limit balíčku",
      amount: userAmount
    });
    
  } else if (userAmount < bundle.userLimit && userAmount > 0) {
    if (userAmount < packages[index-1]?.userLimit ) {
      isUserLimitState = 'default';
    } else if (index === packages.length-1 || userAmount < packages[index+1]?.userLimit) {
      isUserLimitState = 'active';
    } 
  }

  // Collect items that are not selected in this bundle

  for (const [itemId, amount] of Object.entries(amounts?.amounts || {})) {
    if (amount > 0) {
      const item = findItemInCategories(itemId, items);
      if (item?.packages?.[index] && !item.packages[index].selected) {
        nonSelectedItems.push({
          name: item.name,
          amount: amount
        });
      }
    }
  }
  if (nonSelectedItems.length > 0) {
    return { 
      state: 'inactive',
      reason: 'nonSelectedItems',
      items: nonSelectedItems
    };
  }

  // If any item has amount and is selected in this bundle, mark as active
  const selectedItems = [];
  let returnUserAmountState = false;
  for (const [itemId, amount] of Object.entries(amounts?.amounts || {})) {
    if (amount > 0) {
      const item = findItemInCategories(itemId, items);
      if (index > 0) {
        if (item?.packages?.[index-1] && item.packages[index-1].selected) {
          returnUserAmountState = true
        }
      }
      if (item?.packages?.[index] && item.packages[index].selected) {
        selectedItems.push({
          name: item.name,
          amount: amount
        });
      }
    }
  }
  if (selectedItems.length > 0) {
    return { 
      state: 'active',
      items: selectedItems
    };
  }

  return { state: 'default' };
};

// Helper function to find an item in the category tree
const findItemInCategories = (itemId, categories) => {
  for (const category of categories) {
    if (category.type === 'category' && category.children) {
      const item = category.children.find(i => i.id.toString() === itemId);
      if (item) return item;
      
      const foundInSubcategory = findItemInCategories(itemId, category.children.filter(child => child.type === 'category'));
      if (foundInSubcategory) return foundInSubcategory;
    }
  }
  return null;
};

export const createBundleStructure = ({
  id,
  name = 'Custom Bundle',
  userId = null,
  status = 'draft',
  packages = []
}) => {
  return {
    id,
    name,
    userId,
    createdAt: new Date().toISOString(),
    status,
    packages
  };
};

export const createPackageStructure = ({
  id,
  name,
  items = {},
  totalPrice = 0
}) => {
  return {
    id,
    name,
    totalPrice,
    items
  };
};

export const formatBundleItems = (items, amounts = {}) => {
  return Object.keys(items).reduce((acc, itemId) => {
    acc[itemId] = {
      selected: items[itemId]?.selected ?? false,
      individual: items[itemId]?.individual ?? false,
      price: items[itemId]?.price ?? 0,
      amount: amounts[itemId] || 0
    };
    return acc;
  }, {});
};

export const calculateBundleTotal = (bundle, items, amounts) => {
  if (!items?.length || !bundle?.userLimit) {
    return 0;
  }

  const userCount = amounts?.amounts?.[1] || 0;
  if (userCount > bundle.userLimit) {
    return 0;
  }

  return items
    .filter(item => item instanceof Item && item.type !== 'category')
    .reduce((total, item) => {
      const amount = amounts?.amounts?.[item.id.toString()] ?? 0;
      const fixaceAmount = amounts?.fixace?.[item.id.toString()] ?? 0;
      // Update item's internal state with amounts and discounts
      item.setAmounts(amount, fixaceAmount);
      item.setDiscounts(
        amounts?.discount?.[`${item.id}_fixed_items`] ?? amounts?.globalDiscount ?? 0,
        amounts?.discount?.[`${item.id}_over_fixation_items`] ?? 0,
        amounts?.discount?.[`${item.id}`] ?? 0
      );

      return total + item.calculateTotalPrice(bundle.id);
    }, 0);
}; 