import { SupportedCurrency, CurrencyConfig } from '../types/football';

export const CURRENCY_CONFIGS: Record<SupportedCurrency, CurrencyConfig> = {
  TZS: {
    code: 'TZS',
    symbol: 'TSh ',
    name: 'Tanzanian Shilling (TZS)',
    rateToEur: 2850.0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateToEur: 1.0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateToEur: 1.08,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateToEur: 0.85,
  },
  KES: {
    code: 'KES',
    symbol: 'KSh ',
    name: 'Kenyan Shilling',
    rateToEur: 140.0,
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    rateToEur: 1750.0,
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R ',
    name: 'South African Rand',
    rateToEur: 19.5,
  },
};

/**
 * Format an amount stored in base Euros into the active user currency.
 * Defaults strictly to TZS (Tanzanian Shillings) per user requirements.
 */
export function formatMoney(amountInEur: number, currency: SupportedCurrency = 'TZS', compact = false): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.TZS;
  const converted = amountInEur * config.rateToEur;

  if (compact) {
    if (Math.abs(converted) >= 1_000_000_000_000) {
      return `${config.symbol}${(converted / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (Math.abs(converted) >= 1_000_000_000) {
      return `${config.symbol}${(converted / 1_000_000_000).toFixed(1)}B`;
    }
    if (Math.abs(converted) >= 1_000_000) {
      return `${config.symbol}${(converted / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(converted) >= 1_000) {
      return `${config.symbol}${(converted / 1_000).toFixed(0)}K`;
    }
    return `${config.symbol}${Math.round(converted).toLocaleString()}`;
  }

  return `${config.symbol}${Math.round(converted).toLocaleString()}`;
}

export function convertFromEur(amountInEur: number, targetCurrency: SupportedCurrency = 'TZS'): number {
  const config = CURRENCY_CONFIGS[targetCurrency] || CURRENCY_CONFIGS.TZS;
  return amountInEur * config.rateToEur;
}

export function convertToEur(amountInTarget: number, sourceCurrency: SupportedCurrency = 'TZS'): number {
  const config = CURRENCY_CONFIGS[sourceCurrency] || CURRENCY_CONFIGS.TZS;
  return amountInTarget / config.rateToEur;
}
