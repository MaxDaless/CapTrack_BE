import Papa from 'papaparse';
import { CSVFile, Transaction, ColumnMapping } from './types';
import { parseDate, parseNumber } from './utils';

export function parseCSVFile(file: File, broker: string): Promise<CSVFile> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const csvFile: CSVFile = {
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          data: results.data,
          headers: results.meta.fields || [],
          broker,
        };
        resolve(csvFile);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function mapCSVToTransactions(
  csvFile: CSVFile,
  mapping: ColumnMapping
): Transaction[] {
  if (!mapping.date || !mapping.isin || !mapping.direction || !mapping.quantity || !mapping.price) {
    return [];
  }

  const transactions: Transaction[] = [];

  csvFile.data.forEach((row: any, index: number) => {
    try {
      const direction = normalizeDirection(row[mapping.direction!]);

      if (!direction) return; // Skip if not a buy or sell

      const transaction: Transaction = {
        id: `${csvFile.id}-${index}`,
        date: parseDate(row[mapping.date!]),
        isin: row[mapping.isin!]?.toString().trim() || '',
        direction,
        quantity: parseNumber(row[mapping.quantity!]),
        price: parseNumber(row[mapping.price!]),
        fees: mapping.fees ? parseNumber(row[mapping.fees]) : 0,
        broker: csvFile.broker,
        rawData: row,
      };

      if (transaction.isin && transaction.quantity && transaction.price) {
        transactions.push(transaction);
      }
    } catch (error) {
      console.error('Error parsing row:', row, error);
    }
  });

  return transactions;
}

function normalizeDirection(value: string): 'BUY' | 'SELL' | null {
  if (!value) return null;

  const normalized = value.toString().toLowerCase().trim();

  if (normalized.includes('buy') ||
      normalized.includes('achat') ||
      normalized.includes('acheter') ||
      normalized === 'b' ||
      normalized === 'a') {
    return 'BUY';
  }

  if (normalized.includes('sell') ||
      normalized.includes('vente') ||
      normalized.includes('vendre') ||
      normalized === 's' ||
      normalized === 'v') {
    return 'SELL';
  }

  return null;
}

export function detectColumnMapping(headers: string[]): Partial<ColumnMapping> {
  const mapping: Partial<ColumnMapping> = {};

  headers.forEach(header => {
    const lower = header.toLowerCase();

    // Date detection
    if (!mapping.date && (
      lower.includes('date') ||
      lower.includes('datum')
    )) {
      mapping.date = header;
    }

    // ISIN detection
    if (!mapping.isin && (
      lower.includes('isin') ||
      lower.includes('code')
    )) {
      mapping.isin = header;
    }

    // Direction detection
    if (!mapping.direction && (
      lower.includes('type') ||
      lower.includes('transaction') ||
      lower.includes('sens') ||
      lower.includes('direction') ||
      lower.includes('buy') ||
      lower.includes('sell')
    )) {
      mapping.direction = header;
    }

    // Quantity detection
    if (!mapping.quantity && (
      lower.includes('quantity') ||
      lower.includes('quantité') ||
      lower.includes('aantal') ||
      lower.includes('qty') ||
      lower.includes('qté')
    )) {
      mapping.quantity = header;
    }

    // Price detection
    if (!mapping.price && (
      lower.includes('price') ||
      lower.includes('prix') ||
      lower.includes('cours') ||
      lower.includes('koers')
    )) {
      mapping.price = header;
    }

    // Fees detection
    if (!mapping.fees && (
      lower.includes('fee') ||
      lower.includes('frais') ||
      lower.includes('cost') ||
      lower.includes('commission')
    )) {
      mapping.fees = header;
    }
  });

  return mapping;
}
