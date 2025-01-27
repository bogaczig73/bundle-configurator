import { useState, useCallback } from 'react';
import { Item, ItemData, Category } from '../types/Item';
import { ItemsService } from '../services/firebase/items.service';

interface UseItemsReturn {
  loading: boolean;
  error: string | null;
  items: Item[];
  categories: Category[];
  loadItemsForCurrency: (currency: string) => Promise<void>;
  saveItems: (items: (ItemData | Category)[], currency: string) => Promise<void>;
  saveCategories: (categories: Category[]) => Promise<void>;
}

export function useItems(): UseItemsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadItemsForCurrency = useCallback(async (currency: string) => {
    setLoading(true);
    setError(null);
    try {
      const [itemsData, categoriesData] = await Promise.all([
        ItemsService.getItemsForCurrency(currency),
        ItemsService.getCategories()
      ]);
      
      setItems(itemsData.map(item => Item.create(item)));
      setCategories(categoriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveItems = useCallback(async (items: (ItemData | Category)[], currency: string) => {
    setLoading(true);
    setError(null);
    try {
      await ItemsService.saveItems(items, currency);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save items');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCategories = useCallback(async (categories: Category[]) => {
    setLoading(true);
    setError(null);
    try {
      await ItemsService.saveCategories(categories);
      setCategories(categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save categories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    items,
    categories,
    loadItemsForCurrency,
    saveItems,
    saveCategories
  };
} 