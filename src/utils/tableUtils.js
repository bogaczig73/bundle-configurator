import { Item } from '../types/Item';

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