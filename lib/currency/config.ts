export const currencies = {
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US', flag: '🇺🇸' },
  EUR: { symbol: '€', name: 'Euro', locale: 'de-DE', flag: '🇪🇺' },
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB', flag: '🇬🇧' },
  JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', flag: '🇯🇵' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', flag: '🇨🇦' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', flag: '🇦🇺' },
  CHF: { symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH', flag: '🇨🇭' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', flag: '🇨🇳' },
  INR: { symbol: '₹', name: 'Indian Rupee', locale: 'hi-IN', flag: '🇮🇳' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', flag: '🇧🇷' },
  ZAR: { symbol: 'R', name: 'South African Rand', locale: 'en-ZA', flag: '🇿🇦' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG', flag: '🇸🇬' },
  MXN: { symbol: '$', name: 'Mexican Peso', locale: 'es-MX', flag: '🇲🇽' },
  NGN: { symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG', flag: '🇳🇬' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling', locale: 'en-KE', flag: '🇰🇪' },
  GHS: { symbol: '₵', name: 'Ghanaian Cedi', locale: 'en-GH', flag: '🇬🇭' },
};

export type CurrencyCode = keyof typeof currencies;
export const defaultCurrency: CurrencyCode = 'USD';