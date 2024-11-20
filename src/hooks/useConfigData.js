import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useConfigData(bundleId = null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [processedItems, setProcessedItems] = useState([]);
  const [bundleData, setBundleData] = useState(null);

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
                packages: item.packages
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
        // Always fetch default data
        const [packagesSnap, categoriesSnap, itemsSnap] = await Promise.all([
          getDoc(doc(db, 'default', "packages")),
          getDoc(doc(db, 'default', "categories")),
          getDoc(doc(db, 'default', "items"))
        ]);

        // If bundleId exists, also fetch bundle data
        let bundleSnap = null;
        if (bundleId) {
          bundleSnap = await getDoc(doc(db, 'bundles', bundleId));
          if (bundleSnap.exists()) {
            setBundleData(bundleSnap.data());
          } else {
            setError('Bundle not found');
          }
        }

        const packagesData = packagesSnap.exists() ? packagesSnap.data().packages || [] : [];
        const categoriesData = categoriesSnap.exists() ? categoriesSnap.data().categories || [] : [];
        const itemsData = itemsSnap.exists() ? itemsSnap.data().items || [] : [];

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
  }, [bundleId]);

  return {
    loading,
    setLoading,
    error,
    setError,
    categories,
    items,
    packages,
    processedItems,
    setProcessedItems,
    bundleData
  };
} 