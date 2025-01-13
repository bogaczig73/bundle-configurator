import { Item } from '../types/Item';

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

export const isBundleActive = (bundle, index, amounts, bundles) => {
  const userAmount = amounts[1] || 0;
  const previousLimit = index > 0 ? bundles[index - 1].userLimit : 0;
  return userAmount > previousLimit && userAmount <= bundle.userLimit;
};

export const isBundleDisabled = (bundle, index, amounts) => {
  const userAmount = amounts[1] || 0;
  return userAmount > bundle.userLimit;
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