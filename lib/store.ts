import { create } from 'zustand';
import { CSVFile, Transaction, TaxCalculation } from './types';

interface AppState {
  files: CSVFile[];
  transactions: Transaction[];
  taxRate: number;
  exemption: number;

  addFile: (file: CSVFile) => void;
  removeFile: (id: string) => void;
  updateFileMapping: (id: string, mapping: any) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setTaxRate: (rate: number) => void;
  calculateTax: () => TaxCalculation;
  reset: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  files: [],
  transactions: [],
  taxRate: 0.10, // 10% default
  exemption: 10000, // 10,000€ exemption

  addFile: (file) => set((state) => ({
    files: [...state.files, file]
  })),

  removeFile: (id) => set((state) => ({
    files: state.files.filter(f => f.id !== id),
    transactions: state.transactions.filter(t => !t.id.startsWith(id))
  })),

  updateFileMapping: (id, mapping) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, mapping } : f)
  })),

  setTransactions: (transactions) => set({ transactions }),

  setTaxRate: (rate) => set({ taxRate: rate }),

  calculateTax: () => {
    const { transactions, taxRate, exemption } = get();

    // Group transactions by ISIN to calculate P&L
    const positions = new Map<string, {
      buys: Transaction[];
      sells: Transaction[];
    }>();

    transactions.forEach(tx => {
      if (!positions.has(tx.isin)) {
        positions.set(tx.isin, { buys: [], sells: [] });
      }
      const pos = positions.get(tx.isin)!;
      if (tx.direction === 'BUY') {
        pos.buys.push(tx);
      } else {
        pos.sells.push(tx);
      }
    });

    let totalGains = 0;
    let totalLosses = 0;

    // Calculate P&L for each position using FIFO
    positions.forEach((pos) => {
      const buys = [...pos.buys].sort((a, b) => a.date.getTime() - b.date.getTime());
      const sells = [...pos.sells].sort((a, b) => a.date.getTime() - b.date.getTime());

      let buyQueue = buys.map(b => ({ price: b.price, quantity: b.quantity, fees: b.fees }));

      sells.forEach(sell => {
        let remainingToSell = sell.quantity;
        let totalBuyCost = 0;
        let totalBuyFees = 0;

        while (remainingToSell > 0 && buyQueue.length > 0) {
          const buy = buyQueue[0];
          const qtyToUse = Math.min(remainingToSell, buy.quantity);

          totalBuyCost += qtyToUse * buy.price;
          totalBuyFees += (buy.fees / buy.quantity) * qtyToUse;

          remainingToSell -= qtyToUse;
          buy.quantity -= qtyToUse;

          if (buy.quantity === 0) {
            buyQueue.shift();
          }
        }

        const sellValue = sell.quantity * sell.price - sell.fees;
        const buyValue = totalBuyCost + totalBuyFees;
        const pnl = sellValue - buyValue;

        if (pnl > 0) {
          totalGains += pnl;
        } else {
          totalLosses += Math.abs(pnl);
        }
      });
    });

    const netResult = totalGains - totalLosses;
    const taxableAmount = Math.max(0, netResult - exemption);
    const estimatedTax = taxableAmount * taxRate;

    return {
      totalGains,
      totalLosses,
      netResult,
      taxableAmount,
      estimatedTax,
      taxRate,
      exemption,
    };
  },

  reset: () => set({
    files: [],
    transactions: [],
    taxRate: 0.10,
    exemption: 10000,
  }),
}));
