import { CURRENCY_LOCALES } from './constants';

export const roundPrice = (price) => {
  if (typeof price !== 'number') {
    return 0;
  }
  return Math.ceil(price * 100) / 100;
};

export const formatPrice = (price, currency = 'CZK') => {
  if (typeof price !== 'number') {
    return '';
  }

  const roundedPrice = Math.ceil(price);
  const locale = CURRENCY_LOCALES[currency] || CURRENCY_LOCALES.CZK;
  
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(roundedPrice);
  } catch (error) {
    console.error(`Error formatting price: ${error.message}`);
    return `${roundedPrice} ${currency}`;
  }
}; 