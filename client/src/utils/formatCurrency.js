export const formatCurrency = (price, listingType) => {
  if (listingType === 'For Exchange' || price === 0 || price === null || price === undefined) {
    return 'For Exchange';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
