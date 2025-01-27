import { useState, useCallback, useEffect } from 'react';
import { Package } from '../types/Package';
import { PackagesService } from '../services/firebase/packages.service';

interface UsePackagesReturn {
  loading: boolean;
  error: string | null;
  packages: Package[];
  loadPackages: () => Promise<void>;
  savePackages: (packages: Package[]) => Promise<void>;
}

export function usePackages(): UsePackagesReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const packagesData = await PackagesService.getPackages();
      setPackages(packagesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  }, []);

  const savePackages = useCallback(async (packages: Package[]) => {
    setLoading(true);
    setError(null);
    try {
      await PackagesService.savePackages(packages);
      setPackages(packages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save packages');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load packages on mount
  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  return {
    loading,
    error,
    packages,
    loadPackages,
    savePackages
  };
} 