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
  readonly type: ItemType;
  readonly description?: string;
  readonly note?: string;
  readonly packages: Package[];
  amount: number;
  checkbox: boolean;
  individual: boolean;
  readonly fixace?: number;
  discount: number;
  children?: Item[];
  depth?: number;
  price?: number;
  selected?: boolean;

  // New fields for better calculation handling
  private _fixaceAmount: number = 0;
  private _overAmount: number = 0;
  private _fixaceDiscount: number = 0;
  private _overDiscount: number = 0;

  static create(data: ItemData | Partial<ItemData>): Item {
    return new Item(data);
  }

  constructor(data: Partial<ItemData>) {
    this.id = data.id ?? 0;
    this.name = data.name ?? '';
    this.categoryId = data.categoryId ?? 0;
    this.type = data.type ?? 'item';
    this.description = data.description;
    this.note = data.note;
    this.packages = data.packages ?? [];
    this.amount = data.amount ?? 0;
    this.checkbox = data.checkbox ?? false;
    this.individual = data.individual ?? false;
    this.fixace = data.fixace;
    this.discount = data.discount ?? 0;
    this.children = data.children?.map(child => Item.create(child));
    this.depth = data.depth;
    this.price = data.price;
    this.selected = data.selected;

    Object.freeze(this.packages); // Make packages immutable
  }

  // Setters for amounts and discounts
  setAmounts(totalAmount: number, fixaceAmount: number) {
    this._fixaceAmount = Math.min(totalAmount, fixaceAmount);
    this._overAmount = Math.max(0, totalAmount - fixaceAmount);
  }

  setDiscounts(fixaceDiscount: number, overDiscount: number, individualDiscount: number) {
    this._fixaceDiscount = fixaceDiscount;
    this._overDiscount = overDiscount;
    this.discount = individualDiscount;
  }

  // Getters for internal values
  getFixaceAmount(): number {
    return this._fixaceAmount;
  }

  getOverAmount(): number {
    return this._overAmount;
  }

  getFixaceDiscount(): number {
    return this._fixaceDiscount;
  }

  getIndividualDiscount(): number {
    return this.discount;
  }

  getOverDiscount(): number {
    return this._overDiscount;
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

  calculateTotalPrice(bundleId: number): number {
    const basePrice = this.getPrice(bundleId);
    const discountedAmount = this.getDiscount(bundleId);
    
    // Calculate fixace part
    const fixacePrice = Math.ceil(basePrice * this._fixaceAmount * (1 - this._fixaceDiscount / 100));
    
    // Calculate over-fixace part (taking into account discounted amount)
    const overAmount = Math.max(0, this._overAmount - discountedAmount);
    const overPrice = Math.ceil(basePrice * overAmount * (1 - this._overDiscount / 100));
    const individualDiscount = 1-this.getIndividualDiscount()/100;
    const totalPrice = (fixacePrice + overPrice) * individualDiscount;
    return totalPrice;
  }

  hasIndividualDiscounts(amounts: { discount: Record<string, number> }): boolean {
    return amounts.discount?.[`${this.id}_fixed_items`] !== undefined || 
           amounts.discount?.[`${this.id}_over_fixation_items`] !== undefined;
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
  createdBy: string | null;
  customer: string;
  bundleId: string | null;
  status: string;
  items: Record<string, any>;
  currency: string;
  globalDiscount?: number;
} 