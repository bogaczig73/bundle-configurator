import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { doc, getDoc, getDocs, collection, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth } from '../firebase';

export function useConfigData(bundleId = null, configId = null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [processedItems, setProcessedItems] = useState([]);
  const [bundleData, setBundleData] = useState(null);
  const [configurations, setConfigurations] = useState([]);
  const [currentConfig, setCurrentConfig] = useState(null);
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
                packages: item.packages,
                fixace: item.fixace || 0,
                discount: item.discount || 0
              }))
            ]
          };
        });
    };
    return buildCategoryTree(null);
  };

  const getConfigurationById = async (configId) => {
    try {
      console.log('Fetching configuration with ID:', configId);
      const docRef = doc(db, 'configurations', configId);
      const docSnap = await getDoc(docRef);
      
      console.log('Raw snapshot data:', docSnap.data());
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Update processedItems with fixace and discount values from the configuration
        if (data.items) {
          setProcessedItems(prevItems => 
            prevItems.map(item => ({
              ...item,
              fixace: data.items[item.id]?.fixace || 0,
              discount: data.items[item.id]?.discount || 0
            }))
          );
        }
        return {
          id: docSnap.id,
          ...data
        };
      } else {
        console.log('No configuration found with ID:', configId);
        throw new Error('Configuration not found');
      }
    } catch (error) {
      console.error('Error in getConfigurationById:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch configuration if configId is provided
        if (configId) {
          console.log('Starting to fetch config with ID:', configId);
          const configData = await getConfigurationById(configId);
          console.log('Fetched config data:', configData);
          setCurrentConfig(configData);
        }

        // Always fetch default data
        const [packagesSnap, categoriesSnap, itemsSnap, usersSnap, configurationsSnap] = await Promise.all([
          getDoc(doc(db, 'default', "packages")),
          getDoc(doc(db, 'default', "categories")),
          getDoc(doc(db, 'default', "items")),
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'configurations'))
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
        const usersData = usersSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Process configurations data
        const configurationsData = configurationsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCategories(categoriesData);
        setItems(itemsData);
        setPackages(packagesData);
        setUsers(usersData);
        setProcessedItems(processCategories(categoriesData, itemsData));
        setConfigurations(configurationsData);

      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Error loading data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [configId]);

  const refetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all data
      const [itemsSnap, categoriesSnap, packagesSnap, usersSnap] = await Promise.all([
        getDoc(doc(db, 'default', 'items')),
        getDoc(doc(db, 'default', 'categories')),
        getDoc(doc(db, 'default', 'packages')),
        getDocs(collection(db, 'users'))
      ]);

      const itemsData = itemsSnap.data()?.items || [];
      const categoriesData = categoriesSnap.data()?.categories || [];
      const packagesData = packagesSnap.data()?.packages || [];
      const usersData = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setItems(itemsData);
      setCategories(categoriesData);
      setPackages(packagesData);
      setUsers(usersData);
      
      // Process items with categories
      const processed = processCategories(categoriesData, itemsData);
      setProcessedItems(processed);
    } catch (error) {
      console.error('Error fetching config data:', error);
      setError('Failed to fetch configuration data');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfiguration = async (configData) => {
    setLoading(true);
    try {
      const configRef = collection(db, 'configurations');
      
      const configurationData = {
        name: configData.name,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid,
        customer: configData.customerId,
        bundleId,
        items: items.reduce((acc, item) => {
          acc[item.id] = {
            price: item.price || 0,
            amount: configData.amounts[item.id] || 0,
            selected: item.selected || false,
            individual: item.individual || false,
            fixace: item.fixace || 0,
            discount: item.discount || 0
          };
          return acc;
        }, {})
      };

      const docRef = await addDoc(configRef, configurationData);
      return docRef;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw new Error('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (items) => {
    return Object.values(items).reduce((total, item) => {
      return total + (item.price || 0) * (item.amount || 0);
    }, 0);
  };

  const updateItemPrice = useCallback((bundleId, itemId, updates) => {
    setProcessedItems(prevItems => 
      updateItemInTree(prevItems, itemId, (item) => {
        const newPackages = [...(item.packages || [])];
        const packageIndex = newPackages.findIndex(p => p.packageId === bundleId);
        
        if (packageIndex >= 0) {
          newPackages[packageIndex] = {
            ...newPackages[packageIndex],
            ...updates
          };
        } else {
          newPackages.push({
            packageId: bundleId,
            price: 0,
            selected: false,
            ...updates
          });
        }
        
        return { ...item, packages: newPackages };
      })
    );
  }, []);

  const saveItems = async (items) => {
    try {
      const currentItems = getAllItems(items);
      const updatedItems = currentItems.map(({ id, name, categoryId, packages, note, checkbox, individual, fixace, discount }) => ({
        id,
        name,
        categoryId,
        packages: packages || [],
        amount: 0,
        checkbox: checkbox ?? false,
        individual: individual ?? false,
        fixace: fixace ?? 0,
        discount: discount ?? 0,
        ...(note && { note })
      }));

      await updateDoc(doc(db, 'default', 'items'), { items: updatedItems });
    } catch (error) {
      console.error('Error saving items:', error);
      throw error;
    }
  };

  return {
    loading,
    setLoading,
    error,
    setError,
    categories,
    items,
    packages,
    users,
    processedItems,
    setProcessedItems,
    bundleData,
    refetchData,
    saveConfiguration,
    configurations,
    currentConfig,
    getConfigurationById,
    updateItemPrice,
    saveItems,
    updateItemInTree,
    getAllItems
  };
}

export const updateItemInTree = (items, itemId, updateFn) => {
  return items.map(item => {
    if (item.id === itemId) {
      return updateFn(item);
    }
    
    if (item.type === 'category' && item.children) {
      const updatedChildren = updateItemInTree(item.children, itemId, updateFn);
      if (updatedChildren !== item.children) {
        return {
          ...item,
          children: updatedChildren
        };
      }
    }
    return item;
  });
};

export const getAllItems = (items) => {
  return items.reduce((acc, item) => {
    if (item.type === 'item') {
      return [...acc, item];
    } else if (item.children) {
      return [...acc, ...getAllItems(item.children)];
    }
    return acc;
  }, []);
}; 