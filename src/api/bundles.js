// import { collection, getDocs, addDoc, setDoc, getDoc, doc, serverTimestamp, updateDoc, arrayUnion, query, where } from 'firebase/firestore';
// import { db } from '../firebase';
// import { initialBundles } from '../data/bundles';

// export const getBundles = async () => {
//   const snapshot = await getDocs(collection(db, 'bundles'));
//   return snapshot.docs.map(doc => ({
//     id: doc.id,
//     ...doc.data()
//   }));
// }

// export const saveBundle = async (bundleData) => {
//   const docRef = await addDoc(collection(db, 'bundles'), bundleData);
//   return {
//     id: docRef.id,
//     ...bundleData
//   };
// } 


// export const saveConfiguration = async (configData) => {
//   try {
//     console.log('Attempting to save configuration:', configData);
//     const docRef = await setDoc(doc(db, 'bundles', 'AQNCC8bYraXbsR3mxSW5'), {
//       amounts: configData,
//       updatedAt: serverTimestamp()
//     });
//     console.log('Configuration saved successfully');
//     return docRef;
//   } catch (error) {
//     console.error('Error saving configuration:', error);
//     throw error;
//   }
// }

// export const getConfiguration = async () => {
//   try {
//     console.log('Attempting to get configuration');
//     const docSnap = await getDoc(doc(db, 'bundles', 'AQNCC8bYraXbsR3mxSW5'));
//     console.log('Got configuration:', docSnap.data());
//     return docSnap.exists() ? docSnap.data().amounts : {};
//   } catch (error) {
//     console.error('Error getting configuration:', error);
//     throw error;
//   }
// }

// export const saveBundlesConfiguration = async (bundlesData) => {
//   try {
//     console.log('DB instance:', db);
//     console.log('Attempting to save bundles:', bundlesData);
    
//     if (!db) {
//       throw new Error('Firestore instance is not initialized');
//     }

//     const docRef = await setDoc(doc(db, 'bundlesConfiguration', 'current'), {
//       bundles: bundlesData,
//       updatedAt: serverTimestamp()
//     });
    
//     console.log('Save successful, docRef:', docRef);
//     return docRef;
//   } catch (error) {
//     console.error('Error in saveBundlesConfiguration:', error);
//     throw error;
//   }
// };

// export const getBundlesConfiguration = async () => {
//   try {
//     console.log('Attempting to get bundles configuration');
//     const docSnap = await getDoc(doc(db, 'bundlesConfiguration', 'current'));
//     console.log('Got bundles:', docSnap.data());
//     return docSnap.exists() ? docSnap.data().bundles : initialBundles;
//   } catch (error) {
//     console.error('Error getting bundles:', error);
//     throw error;
//   }
// };

// export const createBundle = async (bundleData) => {
//   try {
//     console.log('Creating bundle for user:', bundleData.userId);

//     // Create the bundle document
//     const bundleRef = await addDoc(collection(db, 'bundles'), {
//       ...bundleData,
//       createdAt: new Date().toISOString()
//     });

//     // Update the user's document to include this bundle
//     const userRef = doc(db, 'users', bundleData.userId);
//     await updateDoc(userRef, {
//       bundleIds: arrayUnion(bundleRef.id)
//     });

//     return bundleRef.id;
//   } catch (error) {
//     console.error('Error creating bundle:', error);
//     throw error;
//   }
// };

// export const getUserBundles = async (userId) => {
//   try {
//     const bundlesQuery = query(
//       collection(db, 'bundles'), 
//       where('userId', '==', userId)
//     );
//     const snapshot = await getDocs(bundlesQuery);
//     return snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//   } catch (error) {
//     console.error('Error getting user bundles:', error);
//     throw error;
//   }
// };

// export const createBundleForUser = async (bundleData) => {
//   try {
//     // Create the bundle document
//     const bundleRef = await addDoc(collection(db, 'bundles'), bundleData);

//     // Update the user's document with the bundle reference
//     const userRef = doc(db, 'users', bundleData.userId);
//     await updateDoc(userRef, {
//       bundleIds: arrayUnion(bundleRef.id)
//     });

//     return bundleRef.id;
//   } catch (error) {
//     console.error('Error creating bundle:', error);
//     throw error;
//   }
// };