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
      if (value !== amounts.globalDiscount) {
        // Only set individual discount if value is different from global discount
        onAmountChange(fixedItemKey, value, 'discount');
        onAmountChange(fixedItemKey, true, 'individualDiscounts');
      } else {
        // If value matches global discount, remove individual discount
        onAmountChange(fixedItemKey, false, 'individualDiscounts');
      }
      
      // Update over-fixation items discount
      const overFixationKey = `${item.id}_over_fixation_items`;
      onAmountChange(overFixationKey, value, 'discount');
    } else {
      // Update main item discount
      if (value !== amounts.globalDiscount) {
        // Only set individual discount if value is different from global discount
        onAmountChange(item.id, value, 'discount');
        onAmountChange(item.id, true, 'individualDiscounts');
      } else {
        // If value matches global discount, remove individual discount
        onAmountChange(item.id, false, 'individualDiscounts');
      }
    }
  });

  // Store category discount value
  onAmountChange(category.id, value, 'categoryDiscount');
};

// Helper function to find a category by ID in processedItems
export const findCategoryById = (processedItems, categoryId) => {
  return processedItems.find(item => 
    item.type === 'category' && 
    Number(item.id) === Number(categoryId)
  );
}; 