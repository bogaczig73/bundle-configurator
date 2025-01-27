export interface Package {
  id: string | number;
  name: string;
  userLimit: number;
  note?: string;
  totalPrice?: number;
  items?: Record<string, PackageItem>;
}

export interface PackageItem {
  selected: boolean;
  individual: boolean;
  price: number;
  amount: number;
  discountedAmount?: number;
  note?: string;
} 