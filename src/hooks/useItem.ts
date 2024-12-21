import { useMemo } from 'react';
import { Item } from '../types/Item';

interface UseItemReturn {
  id: number;
  name: string;
  price: number;
  selected: boolean;
  discount: number;
  isFree: boolean;
  totalPrice: number;
  hasValidPackage: boolean;
  fixaceAmount: number;
  overAmount: number;
  fixaceDiscount: number;
  overDiscount: number;
}

export function useItem(
  item: Item,
  bundleId: number,
  amounts: Record<string, number>,
  discounts: Record<string, number>
): UseItemReturn | null {
  return useMemo(() => {
    if (!item) return null;

    const pkg = item.packages.find(p => p.packageId === bundleId);
    const amount = amounts[item.id.toString()] ?? 0;
    const fixaceAmount = item.fixace ?? 0;
    const fixaceDiscount = discounts[`${item.id}-fixace`] ?? discounts[item.id.toString()] ?? item.discount ?? 0;
    const overDiscount = discounts[`${item.id}-over`] ?? discounts[item.id.toString()] ?? item.discount ?? 0;

    // Update item's internal state
    item.setAmounts(amount, fixaceAmount);
    item.setDiscounts(fixaceDiscount, overDiscount);

    return {
      id: item.id,
      name: item.name,
      price: item.getPrice(bundleId),
      selected: item.isSelected(bundleId),
      discount: item.getDiscount(bundleId),
      isFree: item.isFreeForAllBundles(),
      totalPrice: item.calculateTotalPrice(bundleId),
      hasValidPackage: !!pkg,
      fixaceAmount: item.getFixaceAmount(),
      overAmount: item.getOverAmount(),
      fixaceDiscount: item.getFixaceDiscount(),
      overDiscount: item.getOverDiscount()
    };
  }, [item, bundleId, amounts, discounts]);
} 