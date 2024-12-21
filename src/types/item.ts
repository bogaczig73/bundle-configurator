export interface Package {
  packageId: number;
  price: number;
  selected: boolean;
  discountedAmount?: number;
}

export interface Item {
  id: number;
  name: string;
  categoryId: number;
  type?: 'item' | 'category';
  description?: string;
  note?: string;
  packages: Package[];
  amount: number;
  checkbox: boolean;
  individual: boolean;
  fixace?: number;
  discount?: number;
  children?: Item[]; // For categories that contain other items
}

export interface Category {
  id: number;
  name: string;
  type: 'category';
  children: (Item | Category)[];
}

export interface ItemPrice {
  price: number;
  amount: number;
  selected: boolean;
  individual: boolean;
  fixace: number;
  discount: number;
}

export interface Configuration {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  customer: string;
  bundleId: string;
  items: Record<number, ItemPrice>;
} 