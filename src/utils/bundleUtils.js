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