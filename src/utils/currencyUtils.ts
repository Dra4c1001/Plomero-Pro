export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  ratePerUSD: number; // multiplier from USD
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'Dólar (USD)', symbol: '$', ratePerUSD: 1 },
  { code: 'EUR', name: 'Euro (EUR)', symbol: '€', ratePerUSD: 0.92 },
  { code: 'MXN', name: 'Peso Mexicano (MXN)', symbol: '$', ratePerUSD: 18.5 },
  { code: 'BRL', name: 'Real Brasileño (BRL)', symbol: 'R$', ratePerUSD: 5.4 },
  { code: 'ARS', name: 'Peso Argentino (ARS)', symbol: '$', ratePerUSD: 1100 },
  { code: 'COP', name: 'Peso Colombiano (COP)', symbol: '$', ratePerUSD: 4100 },
  { code: 'CLP', name: 'Peso Chileno (CLP)', symbol: '$', ratePerUSD: 940 },
  { code: 'PEN', name: 'Sol Peruano (PEN)', symbol: 'S/.', ratePerUSD: 3.75 }
];

export function convertFromUSD(amountUSD: number, targetCurrencyCode: string): number {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === targetCurrencyCode) || SUPPORTED_CURRENCIES[0];
  const converted = amountUSD * currency.ratePerUSD;
  // Round sensibly based on denomination magnitude
  if (currency.ratePerUSD >= 100) {
    return Math.round(converted / 10) * 10; // Round to nearest 10 for ARS, CLP, COP
  }
  return Math.round(converted * 10) / 10;
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  return `${currency.symbol} ${amount.toLocaleString('es-ES')}`;
}
