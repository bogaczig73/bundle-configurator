import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../firebase';
import { doc, getDoc, getDocs, collection, addDoc, serverTimestamp, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth } from '../firebase';
import { Item, Category, ItemPrice, ItemData } from '../types/Item';
import { Configuration, SaveConfigurationData } from '../types/Configuration';
import { Package } from '../types/Package';
import { ConfigService } from '../services/firebase/config.service';
import { ItemsService } from '../services/firebase/items.service';
import { DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { defaultItems } from '../data/items';
import { usePersistedSettings } from '../hooks/usePersistedSettings';

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
  loadProcessedItems: (currency: string) => Promise<(Item | Category)[]>;
  configurations: Configuration[];
  currentConfig: Configuration | null;
  getConfigurationById: (configId: string) => Promise<Configuration>;
  saveItems: (items: (ItemData | Category)[], currency: string) => Promise<void>;
  handleNewItem: (formData: NewItemFormData, currency: string) => Promise<ItemData>;
  handleDeleteItem: (itemId: number, currency: string) => Promise<void>;
  updateItemPrice: (bundleId: string | number, itemId: number, updates: { price?: number; discountedAmount?: number }) => void;
  handleItemToggle: (bundleId: string | number, itemId: number) => void;
  loadItemsForCurrency: (currency: string) => Promise<(Item | Category)[]>;
  loadCategoriesForCurrency: (currency: string) => Promise<Category[]>;
  processCategories: (categories: Category[], items: Item[]) => (Category | Item)[];
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
  excludeFromGlobalDiscount?: boolean;
  note?: string;
  order?: number;
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


  // Use the service functions
  const loadItemsForCurrency = useCallback(async (currency: string) => {
    const itemsData = await ItemsService.getItemsForCurrency(currency);
    return itemsData.map(item => Item.create(item));
  }, []);

  const loadCategoriesForCurrency = useCallback(async (currency: string) => {
    try {
      const categoriesRef = doc(db, 'default', `categories_${currency.toLowerCase()}`);
      const categoriesSnap = await getDoc(categoriesRef);
      
      if (categoriesSnap.exists()) {
        return categoriesSnap.data().categories || [];
      }
      
      // If no categories exist for this currency, try to get default categories
      const defaultCategoriesRef = doc(db, 'default', 'categories');
      const defaultCategoriesSnap = await getDoc(defaultCategoriesRef);
      
      if (defaultCategoriesSnap.exists()) {
        // Save the default categories to the currency-specific collection
        const defaultCategories = defaultCategoriesSnap.data().categories || [];
        await setDoc(categoriesRef, { 
          categories: defaultCategories,
          currency: currency,
          updatedAt: serverTimestamp()
        });
        return defaultCategories;
      }
      
      return [];
    } catch (error) {
      console.error('Error loading categories for currency:', error);
      throw new Error('Failed to load categories for selected currency');
    }
  }, []);

  const getConfigurationById = useCallback(async (configId: string) => {
    return await ConfigService.getConfigurationById(configId);
  }, []);

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

  // Memoize the fetch function to prevent unnecessary recreations
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch configuration if configId is provided
      if (configId) {
        const configData = await getConfigurationById(configId);
        setCurrentConfig(configData);
        // If configuration has a currency, use it to load the correct items and categories
        if (configData.currency) {
          const [itemsData, categoriesData] = await Promise.all([
            loadItemsForCurrency(configData.currency),
            loadCategoriesForCurrency(configData.currency)
          ]);
          setItems(itemsData);
          setCategories(categoriesData);
          const processedTree = processCategories(categoriesData, itemsData);
          setProcessedItems(processedTree);
        }
      }

      // Fetch default data
      const [packagesSnap, usersSnap, configurationsSnap] = await Promise.all([
        getDoc(doc(db, 'default', "packages")),
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
        const [defaultItemsData, defaultCategoriesData] = await Promise.all([
          loadItemsForCurrency('CZK'),
          loadCategoriesForCurrency('CZK')
        ]);
        setItems(defaultItemsData);
        setCategories(defaultCategoriesData);
        const processedTree = processCategories(defaultCategoriesData, defaultItemsData);
        setProcessedItems(processedTree);
      }

      setPackages(packagesData);
      setUsers(usersData);
      setConfigurations(configurationsData as Configuration[]);

    } catch (err) {
      console.error('Error in fetchData:', err);
      setError('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [configId, bundleId, processCategories, getConfigurationById, loadItemsForCurrency, loadCategoriesForCurrency]);

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
        // Handle category with currency
        const categoriesRef = doc(db, 'default', `categories_${currency.toLowerCase()}`);
        const categoriesSnap = await getDoc(categoriesRef);
        let currentCategories = categoriesSnap.exists() ? categoriesSnap.data()?.categories || [] : [];


        // Ensure currentCategories is an array
        if (!Array.isArray(currentCategories)) {
          console.log('Categories was not an array, initializing empty array');
          currentCategories = [];
        }

        // Create new category data
        const newCategoryData = cleanObject({
          id: formData.id || Date.now(),
          name: formData.name,
          type: 'category',
          parentId: formData.categoryId ? Number(formData.categoryId) : null,
          children: [],
          order: formData.order || 1,
          excludeFromGlobalDiscount: formData.excludeFromGlobalDiscount || false
        });
        // If editing, update existing category
        if (formData.id) {
          // Check if category exists
          const categoryExists = currentCategories.some((cat: Category) => cat.id === formData.id);
          
          if (categoryExists) {
            currentCategories = currentCategories.map((cat: Category) => {
              if (cat.id === formData.id) {
                return newCategoryData;
              }
              return cat;
            });
          } else {
            console.log('Category not found, adding as new');
            currentCategories.push(newCategoryData);
          }
        } else {
          // Add new category
          currentCategories.push(newCategoryData);
        }

        // Sort categories by parent and order
        currentCategories.sort((a: Category, b: Category) => {
          if (a.parentId === b.parentId) {
            return (a.order || 1) - (b.order || 1);
          }
          return (a.parentId || 0) - (b.parentId || 0);
        });
        // Save to Firestore
        const dataToSave = { 
          categories: currentCategories,
          currency: currency.toUpperCase(),
          updatedAt: serverTimestamp()
        };

        await setDoc(categoriesRef, dataToSave);

        // Add delay to ensure Firestore propagation
        await new Promise(resolve => setTimeout(resolve, 500));
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
          categoryId: formData.categoryId ? Number(formData.categoryId) : 0,
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
          excludeFromGlobalDiscount: formData.excludeFromGlobalDiscount || false,
          note: formData.note || "",
          type: 'item',
          order: formData.order || 1
        });
        // Check if item exists
        const itemExists = currentItems.some((item: ItemData) => item.id === formData.id);
        let updatedItems;

        if (formData.id && itemExists) {
          console.log('Updating existing item with ID:', formData.id);
          updatedItems = currentItems.map((item: ItemData) => 
            item.id === formData.id ? newItemData : item
          );
        } else {
          console.log('Adding new item');
          updatedItems = [...currentItems, newItemData];
        }

        // Sort items by category and order
        updatedItems.sort((a: ItemData, b: ItemData) => {
          if (a.categoryId === b.categoryId) {
            return (a.order || 1) - (b.order || 1);
          }
          return (a.categoryId || 0) - (b.categoryId || 0);
        });
        // Save to Firestore
        const dataToSave = { 
          items: updatedItems,
          currency: currency.toUpperCase(),
          updatedAt: serverTimestamp()
        };

        await setDoc(itemsRef, dataToSave);

        // Add delay to ensure Firestore propagation
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchData();
        return Item.create(newItemData);
      }
    } catch (error: any) {
      console.error('Error saving item:', error);
      throw new Error(`Failed to save item: ${error.message}`);
    }
  }, [fetchData]);

  const handleDeleteItem = useCallback(async (itemId: number, currency: string = 'CZK') => {
    try {
      // First check if it's a category
      const categoriesRef = doc(db, 'default', `categories_${currency.toLowerCase()}`);
      const categoriesSnap = await getDoc(categoriesRef);
      const currentCategories = categoriesSnap.data()?.categories || [];
      
      const isCategory = currentCategories.some((cat: Category) => cat.id === itemId);
      
      if (isCategory) {
        // Delete category
        const updatedCategories = currentCategories.filter((cat: Category) => cat.id !== itemId);
        await setDoc(categoriesRef, { 
          categories: updatedCategories,
          currency: currency.toUpperCase(),
          updatedAt: serverTimestamp()
        });
        
        // Also update items that were in this category to have no category
        const itemsRef = doc(db, 'default', `items_${currency.toLowerCase()}`);
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
      } else {
        // Delete item from currency collection
        const itemsRef = doc(db, 'default', `items_${currency.toLowerCase()}`);
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

  const loadProcessedItems = useCallback(async (currency: string) => {
    const itemsData = await loadItemsForCurrency(currency);
    const categoriesData = await loadCategoriesForCurrency(currency);
    const processedTree = processCategories(categoriesData, itemsData);
    return processedTree;
  }, []);

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
    loadItemsForCurrency,
    loadCategoriesForCurrency,
    processCategories,
    loadProcessedItems
  };
} 