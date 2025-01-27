export const flattenItems = (items) => {
  return items.reduce((acc, category) => {
    return [
      ...acc,
      {
        type: 'category',
        name: category.category,
        id: category.category,
      },
      ...(category.items?.map(item => ({
        type: 'item',
        ...item,
        categoryId: category.category,
      })) || []),
      ...(category.subcategories?.flatMap(subcat => [
        {
          type: 'subcategory',
          name: subcat.name,
          id: `${category.category}-${subcat.name}`,
          categoryId: category.category,
        },
        ...subcat.items.map(item => ({
          type: 'item',
          ...item,
          categoryId: category.category,
          subcategoryId: subcat.name,
        }))
      ]) || []),
    ];
  }, []);
}; 