import { db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Package } from '../../types/Package';

export class PackagesService {
  static async getPackages(): Promise<Package[]> {
    try {
      const packagesRef = doc(db, 'default', "packages");
      const packagesSnap = await getDoc(packagesRef);
      
      if (packagesSnap.exists()) {
        return packagesSnap.data().packages || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error loading packages:', error);
      throw new Error('Failed to load packages');
    }
  }

  static async savePackages(packages: Package[]): Promise<void> {
    try {
      const packagesRef = doc(db, 'default', "packages");
      await setDoc(packagesRef, { packages }, { merge: true });
    } catch (error) {
      console.error('Error saving packages:', error);
      throw error;
    }
  }
} 