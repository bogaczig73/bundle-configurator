// import { useState } from 'react';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from '../firebase';

// export const useBundleOperations = (flattenedItems, onSaveSuccess) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSave = async () => {
//     setLoading(true);
//     setError('');
    
//     try {
//       const itemsRef = doc(db, 'default', 'items');
      
//       const updatedItems = flattenedItems
//         .filter(item => item.type === 'item')
//         .map(item => ({
//           id: item.id,
//           amount: 0,
//           toggle: false,
//           individual: false,
//           name: item.name,
//           categoryId: item.categoryId,
//           packages: item.prices || [],
//           ...(item.note && { note: item.note })
//         }));

//       await updateDoc(itemsRef, { items: updatedItems });
//       onSaveSuccess?.();
//     } catch (err) {
//       console.error('Error saving bundles:', err);
//       setError('Failed to save changes. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     loading,
//     error,
//     handleSave
//   };
// }; 