import { useState, useEffect } from 'react';

export function usePersistedSettings(key, defaultValue) {
  // Get initial value from localStorage or use default
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  });

  // Update localStorage when value changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
} 