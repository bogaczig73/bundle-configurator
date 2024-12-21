export interface Package {
  packageId: number;
  price: number;
  selected: boolean;
  discountedAmount?: number;
}

export class Item {
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
  children?: Item[];
  depth?: number;

  constructor(data: Partial<Item>) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.categoryId = data.categoryId || 0;
    this.type = data.type;
    this.description = data.description;
    this.note = data.note;
    this.packages = data.packages || [];
    this.amount = data.amount || 0;
    this.checkbox = data.checkbox || false;
    this.individual = data.individual || false;
    this.fixace = data.fixace;
    this.discount = data.discount;
    this.children = data.children;
    this.depth = data.depth;
  }

  getPrice(bundleId: number): number {
    const pkg = this.packages.find(p => p.packageId === bundleId);
    return pkg?.price || 0;
  }

  isSelected(bundleId: number): boolean {
    const pkg = this.packages.find(p => p.packageId === bundleId);
    return pkg?.selected || false;
  }

  getDiscount(bundleId: number): number {
    const pkg = this.packages.find(p => p.packageId === bundleId);
    return pkg?.discountedAmount || 0;
  }

  isFreeForAllBundles(): boolean {
    return this.packages.every(pkg => pkg.price === 0);
  }

  calculateTotalPrice(bundleId: number, amounts: Record<number, number>, discounts: Record<number, number>): number {
    const basePrice = this.getPrice(bundleId);
    const amount = amounts[this.id] || 0;
    const discount = discounts[this.id] || 0;
    const discountedAmount = this.getDiscount(bundleId);
    
    return basePrice * Math.max(0, amount - discountedAmount) * (1 - discount / 100);
  }

  hasIndividualDiscounts(amounts: { discount: Record<string, number> }): boolean {
    return this.children?.some(
      subItem => amounts.discount[subItem.id] !== undefined
    ) || false;
  }
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