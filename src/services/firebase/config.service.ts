import { db } from '../../firebase';
import { doc, getDoc, getDocs, collection, addDoc, serverTimestamp, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Configuration, SaveConfigurationData } from '../../types/Configuration';

export class ConfigService {
  static async getConfigurationById(configId: string): Promise<Configuration> {
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
  }

  static async saveConfiguration(configData: SaveConfigurationData): Promise<string> {
    try {
      const configRef = await addDoc(collection(db, 'configurations'), {
        ...configData,
        createdAt: serverTimestamp()
      });
      return configRef.id;
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }

  static async updateConfiguration(configId: string, updates: Partial<SaveConfigurationData>): Promise<void> {
    try {
      const configRef = doc(db, 'configurations', configId);
      await updateDoc(configRef, updates);
    } catch (error) {
      console.error('Error updating configuration:', error);
      throw error;
    }
  }

  static async getAllConfigurations(): Promise<Configuration[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'configurations'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Configuration[];
    } catch (error) {
      console.error('Error fetching configurations:', error);
      throw error;
    }
  }
} 