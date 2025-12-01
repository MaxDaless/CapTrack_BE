export interface Transaction {
  id: string;
  date: Date;
  isin: string;
  direction: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  fees: number;
  broker: string;
  rawData?: any;
}

export interface Position {
  isin: string;
  totalBought: number;
  totalSold: number;
  averageBuyPrice: number;
  totalBuyFees: number;
  totalSellFees: number;
  realizedPnL: number;
}

export interface ColumnMapping {
  date?: string;
  isin?: string;
  direction?: string;
  quantity?: string;
  price?: string;
  fees?: string;
}

export interface CSVFile {
  id: string;
  name: string;
  data: any[];
  headers: string[];
  mapping?: ColumnMapping;
  broker: string;
}

export interface TaxCalculation {
  totalGains: number;
  totalLosses: number;
  netResult: number;
  taxableAmount: number;
  estimatedTax: number;
  taxRate: number;
  exemption: number;
}
