'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Download, Filter } from 'lucide-react';
import { Transaction } from '@/lib/types';

export function TransactionsTable() {
  const transactions = useStore((state) => state.transactions);
  const [sortBy, setSortBy] = useState<'date' | 'isin' | 'direction'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterDirection, setFilterDirection] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  const sortedAndFiltered = useMemo(() => {
    let filtered = [...transactions];

    if (filterDirection !== 'ALL') {
      filtered = filtered.filter((t) => t.direction === filterDirection);
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'isin':
          comparison = a.isin.localeCompare(b.isin);
          break;
        case 'direction':
          comparison = a.direction.localeCompare(b.direction);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, sortBy, sortOrder, filterDirection]);

  const handleExportCSV = () => {
    const headers = ['Date', 'ISIN', 'Direction', 'Quantity', 'Price', 'Fees', 'Total', 'Broker'];
    const rows = sortedAndFiltered.map((t) => [
      formatDate(t.date),
      t.isin,
      t.direction,
      t.quantity.toString(),
      formatCurrency(t.price),
      formatCurrency(t.fees),
      formatCurrency(t.quantity * t.price + (t.direction === 'BUY' ? t.fees : -t.fees)),
      t.broker,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>
              {sortedAndFiltered.length} transaction{sortedAndFiltered.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <Button onClick={handleExportCSV} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value as any)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="ALL">All Transactions</option>
              <option value="BUY">Buys Only</option>
              <option value="SELL">Sells Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="date">Date</option>
              <option value="isin">ISIN</option>
              <option value="direction">Direction</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="h-9 px-3 rounded-md border border-input bg-background text-sm hover:bg-accent"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">ISIN</th>
                <th className="text-center p-3 font-medium">Type</th>
                <th className="text-right p-3 font-medium">Quantity</th>
                <th className="text-right p-3 font-medium">Price</th>
                <th className="text-right p-3 font-medium">Fees</th>
                <th className="text-right p-3 font-medium">Total</th>
                <th className="text-left p-3 font-medium">Broker</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFiltered.map((transaction) => {
                const total = transaction.quantity * transaction.price +
                  (transaction.direction === 'BUY' ? transaction.fees : -transaction.fees);

                return (
                  <tr key={transaction.id} className="border-b hover:bg-muted/30">
                    <td className="p-3 financial-number">{formatDate(transaction.date)}</td>
                    <td className="p-3 font-mono text-xs">{transaction.isin}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          transaction.direction === 'BUY'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.direction}
                      </span>
                    </td>
                    <td className="p-3 text-right financial-number">{transaction.quantity}</td>
                    <td className="p-3 text-right financial-number">
                      {formatCurrency(transaction.price)}
                    </td>
                    <td className="p-3 text-right financial-number">
                      {formatCurrency(transaction.fees)}
                    </td>
                    <td className="p-3 text-right financial-number font-medium">
                      {formatCurrency(total)}
                    </td>
                    <td className="p-3">{transaction.broker}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
