import { useMemo } from 'react';
import { Item, Package } from '../types/Item';

interface UseItemReturn {
  price: number;
  isSelected: boolean;
  discount: number;
  isFree: boolean;
  totalPrice: number;
  hasValidPackage: boolean;
}

export function useItem(
  item: Item,
  bundleId: number,
  amounts: Record<number, number> = {},
  discounts: Record<number, number> = {}
): UseItemReturn {
  return useMemo(() => {
    const pkg = item.packages.find(p => p.packageId === bundleId);
    
    return {
      price: item.getPrice(bundleId),
      isSelected: item.isSelected(bundleId),
      discount: item.getDiscount(bundleId),
      isFree: item.isFreeForAllBundles(),
      totalPrice: item.calculateTotalPrice(bundleId, amounts, discounts),
      hasValidPackage: !!pkg
    };
  }, [item, bundleId, amounts, discounts]);
} 