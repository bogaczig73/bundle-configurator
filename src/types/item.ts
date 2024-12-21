export interface Package {
  packageId: number;
  price: number;
  selected: boolean;
  discountedAmount?: number;
}

export type ItemType = 'item' | 'category';

export interface ItemBase {
  id: number;
  name: string;
  categoryId: number;
  type?: ItemType;
  description?: string;
  note?: string;
  amount: number;
  checkbox: boolean;
  individual: boolean;
  fixace?: number;
  discount?: number;
  price?: number;
  selected?: boolean;
}

export interface ItemData extends ItemBase {
  packages: Package[];
  children?: ItemData[];
  depth?: number;
}

export class Item implements ItemData {
  readonly id: number;
  readonly name: string;
  readonly categoryId: number;
  readonly type?: ItemType;
  readonly description?: string;
  readonly note?: string;
  readonly packages: Package[];
  amount: number;
  checkbox: boolean;
  individual: boolean;
  readonly fixace?: number;
  discount?: number;
  children?: Item[];
  depth?: number;
  price?: number;
  selected?: boolean;

  static create(data: ItemData | Partial<ItemData>): Item {
    return new Item(data);
  }

  constructor(data: Partial<ItemData>) {
    this.id = data.id ?? 0;
    this.name = data.name ?? '';
    this.categoryId = data.categoryId ?? 0;
    this.type = data.type;
    this.description = data.description;
    this.note = data.note;
    this.packages = data.packages ?? [];
    this.amount = data.amount ?? 0;
    this.checkbox = data.checkbox ?? false;
    this.individual = data.individual ?? false;
    this.fixace = data.fixace;
    this.discount = data.discount;
    this.children = data.children?.map(child => Item.create(child));
    this.depth = data.depth;
    this.price = data.price;
    this.selected = data.selected;

    Object.freeze(this.packages); // Make packages immutable
  }

  getPrice(bundleId: number): number {
    const pkg = this.packages.find(p => p.packageId === bundleId);
    return pkg?.price ?? this.price ?? 0;
  }

  isSelected(bundleId: number): boolean {
    const pkg = this.packages.find(p => p.packageId === bundleId);
    return pkg?.selected ?? this.selected ?? false;
  }

  getDiscount(bundleId: number): number {
    const pkg = this.packages.find(p => p.packageId === bundleId);
    return pkg?.discountedAmount ?? 0;
  }

  isFreeForAllBundles(): boolean {
    return this.packages.every(pkg => pkg.price === 0);
  }

  calculateTotalPrice(bundleId: number, amounts: Record<number, number>, discounts: Record<number, number>): number {
    const basePrice = this.getPrice(bundleId);
    const amount = amounts[this.id] ?? 0;
    const discount = discounts[this.id] ?? 0;
    const discountedAmount = this.getDiscount(bundleId);
    
    return basePrice * Math.max(0, amount - discountedAmount) * (1 - discount / 100);
  }

  hasIndividualDiscounts(amounts: { discount: Record<string, number> }): boolean {
    return this.children?.some(
      subItem => amounts.discount[subItem.id] !== undefined
    ) ?? false;
  }

  clone(overrides: Partial<ItemData> = {}): Item {
    return Item.create({
      ...this.toPlainObject(),
      ...overrides
    });
  }

  toPlainObject(): ItemData {
    return {
      id: this.id,
      name: this.name,
      categoryId: this.categoryId,
      type: this.type,
      description: this.description,
      note: this.note,
      packages: [...this.packages],
      amount: this.amount,
      checkbox: this.checkbox,
      individual: this.individual,
      fixace: this.fixace,
      discount: this.discount,
      children: this.children?.map(child => child.toPlainObject()),
      depth: this.depth,
      price: this.price,
      selected: this.selected
    };
  }
}

export interface Category {
  id: number;
  name: string;
  type: 'category';
  parentId?: number | null;
  children: (ItemData | Category)[];
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
  createdAt: any;
  createdBy: string;
  customer: string;
  bundleId: string;
  items: Record<number, ItemPrice>;
} 