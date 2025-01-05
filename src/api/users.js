import { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { deleteUser as deleteFirebaseUser } from 'firebase/auth';

// API Functions
export const createUser = async ({ email, password, username, role }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      username,
      email,
      role,
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

export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    // Delete user document from Firestore
    await deleteDoc(doc(db, 'users', userId));
    
    // Get the user auth object
    const user = auth.currentUser;
    if (user && user.uid === userId) {
      // Delete the user from Firebase Auth
      await deleteFirebaseUser(user);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Hook
export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getUser(auth.currentUser.uid);
        if (userData) {
          setUser(userData);
        } else {
          setError('User document not found');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return {
    user,
    loading,
    error,
    logout: async () => {
      try {
        await signOut(auth);
        setUser(null);
      } catch (err) {
        console.error('Error signing out:', err);
        throw err;
      }
    }
  };
} 