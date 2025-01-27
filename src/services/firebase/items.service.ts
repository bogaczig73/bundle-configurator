import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Item, ItemData, Category } from '../../types/Item';
import { defaultItems } from '../../data/items';

export class ItemsService {
  static async getItemsForCurrency(currency: string): Promise<ItemData[]> {
    try {
      const itemsRef = doc(db, 'default', `items_${currency.toLowerCase()}`);
      const itemsSnap = await getDoc(itemsRef);
      
      if (itemsSnap.exists()) {
        return itemsSnap.data().items;
      }
      
      return defaultItems;
    } catch (error) {
      console.error('Error loading items for currency:', error);
      throw new Error('Failed to load items for selected currency');
    }
  }

  static async getCategories(): Promise<Category[]> {
    try {
      const categoriesRef = doc(db, 'default', "categories");
      const categoriesSnap = await getDoc(categoriesRef);
      
      if (categoriesSnap.exists()) {
        return categoriesSnap.data().categories || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error loading categories:', error);
      throw new Error('Failed to load categories');
    }
  }

  static async saveItems(items: (ItemData | Category)[], currency: string): Promise<void> {
    try {
      const itemsRef = doc(db, 'default', `items_${currency.toLowerCase()}`);
      await setDoc(itemsRef, { items }, { merge: true });
    } catch (error) {
      console.error('Error saving items:', error);
      throw error;
    }
  }

  static async saveCategories(categories: Category[]): Promise<void> {
    try {
      const categoriesRef = doc(db, 'default', "categories");
      await setDoc(categoriesRef, { categories }, { merge: true });
    } catch (error) {
      console.error('Error saving categories:', error);
      throw error;
    }
  }
} 