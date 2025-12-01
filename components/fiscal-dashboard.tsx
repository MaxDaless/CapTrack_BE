'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, Scale, Receipt, Percent } from 'lucide-react';

export function FiscalDashboard() {
  const files = useStore((state) => state.files);
  const calculateTax = useStore((state) => state.calculateTax);
  const taxRate = useStore((state) => state.taxRate);
  const setTaxRate = useStore((state) => state.setTaxRate);

  const allMapped = files.length > 0 && files.every((f) => f.mapping);

  if (!allMapped) {
    return null;
  }

  const tax = calculateTax();

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold tracking-tight">Fiscal Summary</h2>
        <p className="text-xs md:text-sm text-muted-foreground">
          Belgian capital gains tax calculation for {new Date().getFullYear()}
        </p>
      </div>

      <div className="grid gap-3 md:gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Gains */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Capital Gains</CardTitle>
            <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold financial-number text-primary">
              {formatCurrency(tax.totalGains)}
            </div>
          </CardContent>
        </Card>

        {/* Total Losses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Capital Losses</CardTitle>
            <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold financial-number text-red-600">
              {formatCurrency(tax.totalLosses)}
            </div>
          </CardContent>
        </Card>

        {/* Net Result */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Net Result (P&L)</CardTitle>
            <Scale className="h-3 w-3 md:h-4 md:w-4 text-foreground/60" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-xl md:text-2xl lg:text-3xl font-bold financial-number ${
                tax.netResult >= 0 ? 'text-primary' : 'text-red-600'
              }`}
            >
              {formatCurrency(tax.netResult)}
            </div>
          </CardContent>
        </Card>

        {/* Taxable Amount */}
        <Card className="border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Taxable Amount</CardTitle>
            <Receipt className="h-3 w-3 md:h-4 md:w-4 text-foreground/60" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl lg:text-3xl font-bold financial-number text-foreground">
              {formatCurrency(tax.taxableAmount)}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              After €{tax.exemption.toLocaleString()} exemption
            </p>
          </CardContent>
        </Card>

        {/* Estimated Tax */}
        <Card className="border-primary/50 md:col-span-2 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Estimated Tax Due</CardTitle>
            <Percent className="h-3 w-3 md:h-4 md:w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold financial-number text-primary">
                  {formatCurrency(tax.estimatedTax)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="tax-rate" className="text-xs md:text-sm font-medium whitespace-nowrap">
                  Rate:
                </label>
                <div className="relative">
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={taxRate * 100}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) / 100)}
                    className="w-16 md:w-20 h-8 md:h-10 pr-5 md:pr-6 text-sm md:text-base financial-number"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs md:text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {tax.netResult > 0 && tax.taxableAmount === 0 && (
        <div className="rounded-lg bg-primary/10 border border-primary/30 p-4">
          <p className="text-sm text-foreground">
            <strong>Good news!</strong> Your net gains (€{tax.netResult.toLocaleString()}) are below the €10,000 exemption threshold. No tax is due.
          </p>
        </div>
      )}
    </div>
  );
}
