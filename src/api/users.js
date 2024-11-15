import { collection, getDocs, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export const createUser = async ({ email, password, username, role }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user data with role in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      role,  // Add role to user document
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    return usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}; 