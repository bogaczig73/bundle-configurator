import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useConfigData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [processedItems, setProcessedItems] = useState([]);

  // Helper function to process categories and items into a tree structure
  const processCategories = (categories, items) => {
    const buildCategoryTree = (parentId = null) => {
      return categories
        .filter(cat => cat.parentId === parentId)
        .map(category => {
          const categoryItems = items.filter(item => item.categoryId === category.id);
          const childCategories = buildCategoryTree(category.id);
          
          return {
            id: category.id,
            name: category.name,
            type: 'category',
            children: [
              ...childCategories,
              ...categoryItems.map(item => ({
                ...item,
                type: 'item',
                name: item.name,
                description: item.note || '',
                prices: item.prices
              }))
            ]
          };
        });
    };

    return buildCategoryTree(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [packagesSnap, categoriesSnap, itemsSnap] = await Promise.all([
          getDoc(doc(db, 'default', "packages")),
          getDoc(doc(db, 'default', "categories")),
          getDoc(doc(db, 'default', "items"))
        ]);

        const packagesData = packagesSnap.exists() ? packagesSnap.data().packages || [] : [];
        const categoriesData = categoriesSnap.exists() ? categoriesSnap.data().categories || [] : [];
        const itemsData = itemsSnap.exists() ? itemsSnap.data().items || [] : [];

        console.log('Fetched Data:', {
          packages: packagesData,
          categories: categoriesData,
          items: itemsData
        });

        setCategories(categoriesData);
        setItems(itemsData);
        setPackages(packagesData);
        setProcessedItems(processCategories(categoriesData, itemsData));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    setLoading,
    error,
    setError,
    categories,
    items,
    packages,
    processedItems,
    setProcessedItems
  };
} 