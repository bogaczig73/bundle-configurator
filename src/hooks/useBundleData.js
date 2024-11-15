import { useState, useEffect } from 'react';
import { getBundlesConfiguration, saveBundlesConfiguration } from '../api/bundles';

export function useBundleData(initialBundles) {
  const [bundlesState, setBundlesState] = useState(initialBundles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBundles = async () => {
      try {
        const savedBundles = await getBundlesConfiguration();
        setBundlesState(savedBundles);
      } catch (error) {
        console.error('Error loading bundles:', error);
        setError('Failed to load bundles');
      }
    };
    loadBundles();
  }, []);

  const saveBundles = async (bundles) => {
    setLoading(true);
    try {
      await saveBundlesConfiguration(bundles);
      setBundlesState(bundles);
    } catch (error) {
      console.error('Error saving bundles:', error);
      setError('Failed to save bundles');
    } finally {
      setLoading(false);
    }
  };

  return { bundlesState, setBundlesState, loading, error, saveBundles };
} 