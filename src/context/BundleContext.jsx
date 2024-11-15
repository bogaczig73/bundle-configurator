import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialBundles } from '../data/bundles';

const BundleContext = createContext();

export function BundleProvider({ children }) {
  // Load saved bundles from localStorage on initial render
  const [bundles, setBundles] = useState(() => {
    const savedBundles = localStorage.getItem('bundles');
    return savedBundles ? JSON.parse(savedBundles) : initialBundles;
  });

  // Save to localStorage whenever bundles change
  useEffect(() => {
    localStorage.setItem('bundles', JSON.stringify(bundles));
  }, [bundles]);

  return (
    <BundleContext.Provider value={{ bundles, setBundles }}>
      {children}
    </BundleContext.Provider>
  );
}

export function useBundles() {
  const context = useContext(BundleContext);
  if (!context) {
    throw new Error('useBundles must be used within a BundleProvider');
  }
  return context;
} 