import { currencies, CurrencyCode } from './config';

export async function getExchangeRate(from: CurrencyCode, to: CurrencyCode): Promise<number> {
  if (from === to) return 1;
  
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();
    return data.rates[to] || 1;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return 1;
  }
}

export async function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): Promise<{ converted: number; rate: number }> {
  const rate = await getExchangeRate(from, to);
  return {
    converted: amount * rate,
    rate
  };
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const config = currencies[currency];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatCompactCurrency(amount: number, currency: CurrencyCode): string {
  const config = currencies[currency];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}