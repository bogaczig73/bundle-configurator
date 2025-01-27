import { useState, useCallback, useEffect } from 'react';
import { Configuration, SaveConfigurationData } from '../types/Configuration';
import { ConfigService } from '../services/firebase/config.service';

interface UseConfigurationReturn {
  loading: boolean;
  error: string | null;
  configuration: Configuration | null;
  configurations: Configuration[];
  saveConfiguration: (data: SaveConfigurationData) => Promise<string>;
  updateConfiguration: (configId: string, updates: Partial<SaveConfigurationData>) => Promise<void>;
  loadConfiguration: (configId: string) => Promise<void>;
  loadAllConfigurations: () => Promise<void>;
}

export function useConfiguration(initialConfigId?: string): UseConfigurationReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);

  const loadConfiguration = useCallback(async (configId: string) => {
    setLoading(true);
    setError(null);
    try {
      const config = await ConfigService.getConfigurationById(configId);
      setConfiguration(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAllConfigurations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const configs = await ConfigService.getAllConfigurations();
      setConfigurations(configs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configurations');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfiguration = useCallback(async (data: SaveConfigurationData) => {
    setLoading(true);
    setError(null);
    try {
      const configId = await ConfigService.saveConfiguration(data);
      await loadAllConfigurations(); // Refresh the list
      return configId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadAllConfigurations]);

  const updateConfiguration = useCallback(async (configId: string, updates: Partial<SaveConfigurationData>) => {
    setLoading(true);
    setError(null);
    try {
      await ConfigService.updateConfiguration(configId, updates);
      if (configuration?.id === configId) {
        setConfiguration(prev => prev ? { ...prev, ...updates } : null);
      }
      await loadAllConfigurations(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [configuration, loadAllConfigurations]);

  // Load initial configuration if ID is provided
  useEffect(() => {
    if (initialConfigId) {
      loadConfiguration(initialConfigId);
    }
  }, [initialConfigId, loadConfiguration]);

  // Load all configurations on mount
  useEffect(() => {
    loadAllConfigurations();
  }, [loadAllConfigurations]);

  return {
    loading,
    error,
    configuration,
    configurations,
    saveConfiguration,
    updateConfiguration,
    loadConfiguration,
    loadAllConfigurations
  };
} 