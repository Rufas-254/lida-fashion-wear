/**
 * Format a number as Kenyan Shillings (KES)
 * @param {number} amount
 * @param {boolean} showCode - show "KES" prefix
 * @returns {string}
 */
export const formatCurrency = (amount, showCode = true) => {
  const formatted = new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

  return showCode ? `KES ${formatted}` : formatted;
};

export default formatCurrency;
