import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../firebase';
import { doc, getDoc, getDocs, collection, addDoc, serverTimestamp, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth } from '../firebase';
import { Item, Category, Configuration, ItemPrice, ItemData } from '../types/Item';
import { DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { defaultItems } from '../data/items';

interface Package {
  id: string | number;
  name: string;
  userLimit: number;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface ItemPackage {
  packageId: number;
  price: number;
  selected: boolean;
  discountedAmount?: number;
  note?: string;
}

interface UseConfigDataReturn {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string;
  setError: (error: string) => void;
  categories: Category[];
  items: Item[];
  packages: Package[];
  users: User[];
  processedItems: (Item | Category)[];
  setProcessedItems: (items: (Item | Category)[]) => void;
  bundleData: any;
  refetchData: () => Promise<void>;
  saveConfiguration: (configData: SaveConfigurationData) => Promise<any>;
  updateConfiguration: (configId: string, updates: Partial<SaveConfigurationData>) => Promise<void>;
  configurations: Configuration[];
  currentConfig: Configuration | null;
  getConfigurationById: (configId: string) => Promise<Configuration>;
  saveItems: (items: (ItemData | Category)[], currency: string) => Promise<void>;
  handleNewItem: (formData: NewItemFormData, currency: string) => Promise<ItemData>;
  handleDeleteItem: (itemId: number) => Promise<void>;
  updateItemPrice: (bundleId: string | number, itemId: number, updates: { price?: number; discountedAmount?: number }) => void;
  handleItemToggle: (bundleId: string | number, itemId: number) => void;
  loadItemsForCurrency: (currency: string) => Promise<(Item | Category)[]>;
}

interface SaveConfigurationData {
  bundleId: string;
  name: string;
  customerId: string;
  items: Record<string, {
    amount: number;
    discount: number;
    fixace: number;
    individual: boolean;
    checkbox: boolean;
    price: number;
    selected: boolean;
  }>;
  status: string;
  createdBy: string | null;
  currency: string;
  globalDiscount?: number;
  isPrivate?: boolean;
}

interface NewItemFormData {
  id?: number;
  name: string;
  type: 'item' | 'category';
  categoryId: number | null;
  packages: Array<{
    packageId: number;
    price: number | string;
    selected: boolean;
    discountedAmount?: number;
    note?: string;
  }>;
  amount: number;
  checkbox: boolean;
  individual: boolean;
  note?: string;
}


export const CURRENCIES = [
  { code: 'CZK', symbol: 'Kč', name: 'Český' },
  { code: 'EUR', symbol: '€', name: 'Slovenský' },
];

// Helper function to clean objects before saving to Firestore
const cleanObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(cleanObject).filter(item => item !== undefined);
  }
  
  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleanValue = cleanObject(value);
      if (cleanValue !== undefined) {
        acc[key] = cleanValue;
      }
      return acc;
    }, {} as any);
  }
  
  return obj === undefined ? null : obj;
};

// Helper function to get all items from the tree structure
const getAllItems = (items: (ItemData | Category)[]): ItemData[] => {
  return items.reduce<ItemData[]>((acc, item) => {
    if ('type' in item && item.type === 'item') {
      // Convert Item instance to plain object if it's an Item instance
      const plainItem = item instanceof Item ? item.toPlainObject() : item;
      return [...acc, cleanObject(plainItem)];
    } else if ('children' in item && Array.isArray(item.children)) {
      return [...acc, ...getAllItems(item.children as (ItemData | Category)[])];
    }
    return acc;
  }, []);
};

export function useConfigData(bundleId: string | null = null, configId: string | null = null): UseConfigDataReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [processedItems, setProcessedItems] = useState<(Item | Category)[]>([]);
  const [bundleData, setBundleData] = useState<any>(null);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [currentConfig, setCurrentConfig] = useState<Configuration | null>(null);

  // Memoized function to process categories and items into a tree structure
  const processCategories = useCallback((categories: Category[], items: Item[]): (Category | Item)[] => {
    const buildCategoryTree = (parentId: number | null = null): (Category | Item)[] => {
      const categoriesAtLevel = categories.filter(cat => {
        const catParentId = cat.parentId ? Number(cat.parentId) : null;
        return catParentId === parentId;
      });
      const itemsAtLevel = items.filter(item => {
        // If we're at root level (parentId is null), include items with no category or invalid category
        if (parentId === null) {
          return !item.categoryId || !categories.find(cat => Number(cat.id) === Number(item.categoryId));
        }
        // Otherwise, include items that belong to this category
        return Number(item.categoryId) === Number(parentId);
      }).map(item => Item.create(item));

      return [
        ...categoriesAtLevel.map(category => ({
          id: Number(category.id),
          name: category.name,
          type: 'category' as const,
          parentId: category.parentId ? Number(category.parentId) : null,
          children: buildCategoryTree(Number(category.id))
        })),
        ...itemsAtLevel
      ];
    };
    
    return buildCategoryTree(null);
  }, []);

  const loadItemsForCurrency = useCallback(async (currency: string): Promise<(Item | Category)[]> => {
    try {
      const itemsRef = doc(db, 'default', `items_${currency.toLowerCase()}`);
      const categoriesRef = doc(db, 'default', "categories");
      
      const [itemsSnap, categoriesSnap] = await Promise.all([
        getDoc(itemsRef),
        getDoc(categoriesRef)
      ]);
      
      const categoriesData = categoriesSnap.exists() ? categoriesSnap.data().categories || [] : [];
      let itemsData;
      
      if (itemsSnap.exists()) {
        itemsData = itemsSnap.data().items;
      } else {
        // If no currency-specific items exist, load default items
        itemsData = defaultItems;
      }

      // Convert raw items to Item instances
      const itemInstances = itemsData.map((item: ItemData) => Item.create(item));
      
      // Process items with categories
      return processCategories(categoriesData, itemInstances);
    } catch (err) {
      console.error('Error loading items for currency:', err);
      throw new Error('Failed to load items for selected currency');
    }
  }, [processCategories]);

  const getConfigurationById = useCallback(async (configId: string): Promise<Configuration> => {
    try {
      if (!configId) {
        throw new Error('Configuration ID is required');
      }

      const docRef = doc(db, 'configurations', configId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Configuration not found');
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Configuration;
    } catch (error) {
      console.error('Error in getConfigurationById:', error);
      throw error;
    }
  }, []);

  // Memoize the fetch function to prevent unnecessary recreations
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch configuration if configId is provided
      if (configId) {
        const configData = await getConfigurationById(configId);
        setCurrentConfig(configData);
        // If configuration has a currency, use it to load the correct items
        if (configData.currency) {
          const itemsRef = doc(db, 'default', `items_${configData.currency.toLowerCase()}`);
          const itemsSnap = await getDoc(itemsRef);
          const itemsData = itemsSnap.exists() ? itemsSnap.data().items || [] : [];
          const itemInstances = itemsData.map((item: ItemData) => Item.create(item));
          setItems(itemInstances);
        }
      }

      // Fetch default data
      const [packagesSnap, categoriesSnap, usersSnap, configurationsSnap] = await Promise.all([
        getDoc(doc(db, 'default', "packages")),
        getDoc(doc(db, 'default', "categories")),
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'configurations'))
      ]);
      
      // If bundleId exists, fetch bundle data
      if (bundleId) {
        const bundleSnap = await getDoc(doc(db, 'bundles', bundleId));
        if (bundleSnap.exists()) {
          setBundleData(bundleSnap.data());
        } else {
          throw new Error('Bundle not found');
        }
      }

      const packagesData = packagesSnap.exists() ? packagesSnap.data().packages || [] : [];
      const categoriesData = categoriesSnap.exists() ? categoriesSnap.data().categories || [] : [];

      const usersData = usersSnap.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email || '',
        name: doc.data().name || '',
        ...doc.data()
      })) as User[];
      
      const configurationsData = configurationsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Only process items if we haven't already loaded them from a configuration
      if (!configId) {
        const defaultItemsRef = doc(db, 'default', 'items_czk');
        const defaultItemsSnap = await getDoc(defaultItemsRef);
        const itemsData = defaultItemsSnap.exists() ? defaultItemsSnap.data().items || [] : [];
        const itemInstances = itemsData.map((item: ItemData) => Item.create(item));
        setItems(itemInstances);
        const processedTree = processCategories(categoriesData, itemInstances);
        setProcessedItems(processedTree);
      }

      setCategories(categoriesData);
      setPackages(packagesData);
      setUsers(usersData);
      setConfigurations(configurationsData as Configuration[]);

    } catch (err) {
      console.error('Error in fetchData:', err);
      setError('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [configId, bundleId, processCategories, getConfigurationById]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveConfiguration = useCallback(async (configData: SaveConfigurationData) => {
    setLoading(true);
    try {
      const configRef = collection(db, 'configurations');
      const configurationData = {
        name: configData.name,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid || configData.createdBy ||  null,
        customer: configData.customerId,
        bundleId: configData.bundleId || null,
        status: configData.status || 'draft',
        items: configData.items,
        currency: configData.currency || 'CZK',
        globalDiscount: configData.globalDiscount || 0,
        isPrivate: configData.isPrivate || false
      };

      const docRef = await addDoc(configRef, configurationData);
      return docRef;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw new Error('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveItems = useCallback(async (items: (ItemData | Category)[], currency: string = 'CZK') => {
    setLoading(true);
    try {
      // Get all items and ensure they are plain objects
      const allItems = getAllItems(items).map(item => 
        cleanObject(item instanceof Item ? item.toPlainObject() : item)
      );
      
      // Save to Firestore in currency-specific collection
      await setDoc(doc(db, 'default', `items_${currency.toLowerCase()}`), {
        items: allItems,
        currency: currency,
        updatedAt: serverTimestamp()
      });

      console.log('Items saved successfully:', allItems.length);
    } catch (err) {
      console.error('Error saving items:', err);
      setError('Failed to save items. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const handleNewItem = useCallback(async (formData: NewItemFormData, currency: string = 'CZK') => {
    try {
      if (formData.type === 'category') {
        // Handle category
        const newCategoryData = cleanObject({
          id: formData.id || Date.now(),
          name: formData.name,
          type: 'category',
          parentId: formData.categoryId ? Number(formData.categoryId) : null,
          children: []
        });

        // Get current categories
        const categoriesRef = doc(db, 'default', 'categories');
        const categoriesSnap = await getDoc(categoriesRef);
        const currentCategories = categoriesSnap.data()?.categories || [];

        if (formData.id) {
          // Editing existing category
          const updatedCategories = currentCategories.map((cat: Category) => 
            cat.id === formData.id ? newCategoryData : cat
          );
          await setDoc(categoriesRef, { categories: updatedCategories });
        } else {
          // Creating new category
          await updateDoc(categoriesRef, {
            categories: arrayUnion(newCategoryData)
          });
        }

        await fetchData();
        return newCategoryData;
      } else {
        // Handle item
        const itemsRef = doc(db, 'default', `items_${currency.toLowerCase()}`);
        const itemsSnap = await getDoc(itemsRef);
        const currentItems = itemsSnap.data()?.items || [];

        const newItemData = cleanObject({
          id: formData.id || Date.now(),
          name: formData.name,
          categoryId: Number(formData.categoryId) || 0,
          packages: formData.packages.map(pkg => ({
            packageId: Number(pkg.packageId),
            price: Number(pkg.price) || 0,
            selected: pkg.selected || false,
            discountedAmount: Number(pkg.discountedAmount) || 0,
            note: pkg.note || ''
          })),
          amount: Number(formData.amount) || 0,
          checkbox: formData.checkbox || false,
          individual: formData.individual || false,
          note: formData.note || "",
          type: 'item'
        });

        if (formData.id) {
          // Editing existing item
          const updatedItems = currentItems.map((item: ItemData) => 
            item.id === formData.id ? newItemData : item
          );
          await setDoc(itemsRef, { 
            items: updatedItems,
            currency: currency,
            updatedAt: serverTimestamp()
          });
        } else {
          // Creating new item
          await updateDoc(itemsRef, {
            items: arrayUnion(newItemData)
          });
        }

        await fetchData();
        return Item.create(newItemData);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      throw error;
    }
  }, [fetchData]);

  const handleDeleteItem = useCallback(async (itemId: number) => {
    try {
      // First check if it's a category
      const categoriesRef = doc(db, 'default', 'categories');
      const categoriesSnap = await getDoc(categoriesRef);
      const currentCategories = categoriesSnap.data()?.categories || [];
      
      const isCategory = currentCategories.some((cat: Category) => cat.id === itemId);
      
      if (isCategory) {
        // Delete category
        const updatedCategories = currentCategories.filter((cat: Category) => cat.id !== itemId);
        await setDoc(categoriesRef, { categories: updatedCategories });
        
        // Also update items that were in this category to have no category
        // We need to update items in all currency collections
        const currencies = ['czk', 'eur', 'usd'];
        await Promise.all(currencies.map(async (currency) => {
          const itemsRef = doc(db, 'default', `items_${currency}`);
          const itemsSnap = await getDoc(itemsRef);
          if (itemsSnap.exists()) {
            const currentItems = itemsSnap.data()?.items || [];
            const updatedItems = currentItems.map((item: ItemData) => 
              item.categoryId === itemId ? { ...item, categoryId: null } : item
            );
            await setDoc(itemsRef, { 
              items: updatedItems,
              currency: currency.toUpperCase(),
              updatedAt: serverTimestamp()
            });
          }
        }));
      } else {
        // Delete item from all currency collections
        const currencies = ['czk', 'eur', 'usd'];
        await Promise.all(currencies.map(async (currency) => {
          const itemsRef = doc(db, 'default', `items_${currency}`);
          const itemsSnap = await getDoc(itemsRef);
          if (itemsSnap.exists()) {
            const currentItems = itemsSnap.data()?.items || [];
            const updatedItems = currentItems.filter((item: ItemData) => item.id !== itemId);
            await setDoc(itemsRef, { 
              items: updatedItems,
              currency: currency.toUpperCase(),
              updatedAt: serverTimestamp()
            });
          }
        }));
      }

      await fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }, [fetchData]);

  const updateItemInTree = useCallback((items: any[], itemId: number, updateFn: (item: any) => Item): (Item | Category)[] => {
    return items.map(item => {
      if ('children' in item && Array.isArray(item.children)) {
        return {
          ...item,
          children: updateItemInTree(item.children, itemId, updateFn)
        } as Category;
      }
      
      if ('id' in item && item.id === itemId) {
        return updateFn(item);
      }
      
      return item;
    });
  }, []);

  const updateItemPrice = useCallback((bundleId: string | number, itemId: number, updates: { price?: number; discountedAmount?: number }) => {
    setProcessedItems(prevItems => {
      return updateItemInTree(prevItems, itemId, (item) => {
        const currentPackages = (item.packages || []) as ItemPackage[];
        const packageIndex = currentPackages.findIndex((p: ItemPackage) => 
          String(p.packageId) === String(bundleId)
        );
        
        let newPackages;
        if (packageIndex >= 0) {
          newPackages = [...currentPackages];
          newPackages[packageIndex] = {
            ...newPackages[packageIndex],
            ...updates
          };
        } else {
          newPackages = [
            ...currentPackages,
            {
              packageId: Number(bundleId),
              selected: false,
              price: updates.price || 0,
              discountedAmount: updates.discountedAmount || 0
            }
          ];
        }
        
        // Create a new ItemData object with all required fields
        const itemData: ItemData = {
          id: item.id,
          name: item.name,
          categoryId: 'categoryId' in item ? item.categoryId : 0,
          packages: newPackages,
          amount: 'amount' in item ? item.amount : 0,
          checkbox: 'checkbox' in item ? item.checkbox : false,
          individual: 'individual' in item ? item.individual : false,
          note: 'note' in item ? item.note : '',
          type: 'item'
        };
        
        // Convert ItemData to Item using the create method
        return Item.create(itemData);
      });
    });
  }, [updateItemInTree]);

  const handleItemToggle = useCallback((bundleId: string | number, itemId: number) => {
    setProcessedItems(prevItems => {
      return updateItemInTree(prevItems, itemId, (item) => {
        const currentPackages = (item.packages || []) as ItemPackage[];
        const packageIndex = currentPackages.findIndex((p: ItemPackage) => 
          String(p.packageId) === String(bundleId)
        );
        
        let newPackages;
        if (packageIndex >= 0) {
          newPackages = [...currentPackages];
          newPackages[packageIndex] = {
            ...newPackages[packageIndex],
            selected: !newPackages[packageIndex].selected
          };
        } else {
          newPackages = [
            ...currentPackages,
            {
              packageId: Number(bundleId),
              selected: true,
              price: 0,
              discountedAmount: 0
            }
          ];
        }
        
        const itemData: ItemData = {
          id: item.id,
          name: item.name,
          categoryId: 'categoryId' in item ? item.categoryId : 0,
          packages: newPackages,
          amount: 'amount' in item ? item.amount : 0,
          checkbox: 'checkbox' in item ? item.checkbox : false,
          individual: 'individual' in item ? item.individual : false,
          note: 'note' in item ? item.note : '',
          type: 'item'
        };
        
        return Item.create(itemData);
      });
    });
  }, [updateItemInTree]);

  const updateConfiguration = useCallback(async (configId: string, updates: Partial<SaveConfigurationData>) => {
    setLoading(true);
    try {
      const configRef = doc(db, 'configurations', configId);
      const updatedData = {
        ...updates,
        // Convert customerId to customer field if it exists
        ...(updates.customerId && { customer: updates.customerId }),
        updatedAt: serverTimestamp()
      };
      // Remove customerId from the update as we use customer in the database
      if ('customerId' in updatedData) {
        delete updatedData.customerId;
      }
      await updateDoc(configRef, updatedData);
      await fetchData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating configuration:', error);
      throw new Error('Failed to update configuration');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

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
    refetchData: fetchData,
    saveConfiguration,
    updateConfiguration,
    configurations,
    currentConfig,
    getConfigurationById,
    saveItems,
    handleNewItem,
    handleDeleteItem,
    updateItemPrice,
    handleItemToggle,
    loadItemsForCurrency
  };
} 