// Helper function to find all items in a category
export const getItemsInCategory = (category) => {
  if (!category?.children) return [];
  return category.children.filter(item => item.type === 'item');
};

// Helper function to apply discount to category items
export const applyCategoryDiscount = ({ 
  category, 
  value, 
  showFixace, 
  onAmountChange, 
  amounts 
}) => {
  const items = getItemsInCategory(category);
  // Update discounts for all items
  items.forEach(item => {
    if (showFixace) {
      // Update fixed items discount
      const fixedItemKey = `${item.id}_fixed_items`;
      
      // For items excluded from global discount, always set as individual discount
      if (item.excludeFromGlobalDiscount) {
        onAmountChange(fixedItemKey, value, 'discount');
        onAmountChange(fixedItemKey, true, 'individualDiscounts');
      } else {
        // For other items, follow normal logic
        if (value !== amounts.globalDiscount) {
          onAmountChange(fixedItemKey, value, 'discount');
          onAmountChange(fixedItemKey, true, 'individualDiscounts');
        } else {
          onAmountChange(fixedItemKey, false, 'individualDiscounts');
        }
      }
      
      // Update over-fixation items discount
      const overFixationKey = `${item.id}_over_fixation_items`;
      onAmountChange(overFixationKey, value, 'discount');
    } else {
      // Update main item discount
      if (item.excludeFromGlobalDiscount) {
        onAmountChange(item.id, value, 'discount');
        onAmountChange(item.id, true, 'individualDiscounts');
      } else {
        if (value !== amounts.globalDiscount) {
          onAmountChange(item.id, value, 'discount');
          onAmountChange(item.id, true, 'individualDiscounts');
        } else {
          onAmountChange(item.id, false, 'individualDiscounts');
        }
      }
    }
  });

  // Store category discount value
  onAmountChange(category.id, value, 'categoryDiscount');
};

// Helper function to find a category by ID in processedItems
export const findCategoryById = (processedItems, categoryId) => {
  const searchInItems = (items) => {
    for (const item of items) {
      // Check if current item is the category we're looking for
      if (item.type === 'category' && Number(item.id) === Number(categoryId)) {
        return item;
      }
      
      // If item has children, recursively search in them
      if (item.children && item.children.length > 0) {
        const found = searchInItems(item.children);
        if (found) return found;
      }
    }
    return null;
  };

  return searchInItems(processedItems);
}; 