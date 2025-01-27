export interface Configuration {
  id: string;
  bundleId: string;
  name: string;
  customerId: string;
  items: Record<string, ConfigurationItem>;
  status: string;
  createdBy: string | null;
  currency: string;
  globalDiscount?: number;
  isPrivate?: boolean;
  createdAt?: Date;
}

export interface ConfigurationItem {
  amount: number;
  discount: number;
  fixace: number;
  individual: boolean;
  checkbox: boolean;
  price: number;
  selected: boolean;
}

export interface SaveConfigurationData {
  bundleId: string;
  name: string;
  customerId: string;
  items: Record<string, ConfigurationItem>;
  status: string;
  createdBy: string | null;
  currency: string;
  globalDiscount?: number;
  isPrivate?: boolean;
} 