'use client';

import { CSVUpload } from '@/components/csv-upload';
import { ColumnMapper } from '@/components/column-mapper';
import { FiscalDashboard } from '@/components/fiscal-dashboard';
import { TransactionsTable } from '@/components/transactions-table';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { FileText, RotateCcw } from 'lucide-react';

export default function Home() {
  const files = useStore((state) => state.files);
  const transactions = useStore((state) => state.transactions);
  const reset = useStore((state) => state.reset);

  const handleReset = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      reset();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4 md:py-6 lg:py-8 max-w-7xl relative">
        {/* Header */}
        <div className="mb-4 md:mb-6 lg:mb-8">
          <div className="flex flex-col items-center mb-4 md:mb-6">
            <img
              src="/logo.png"
              alt="CapTrack BE"
              className="h-16 md:h-24 lg:h-32 w-auto mb-3 md:mb-4"
            />
            {files.length > 0 && (
              <Button onClick={handleReset} variant="outline" size="sm" className="md:absolute md:top-4 md:right-4">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 md:p-4">
            <p className="text-xs md:text-sm text-foreground text-center">
              <strong>Privacy First:</strong> All calculations performed in your browser. Your data never leaves your device.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4 md:space-y-6 lg:space-y-8">
          {/* Upload Section */}
          <section>
            <CSVUpload />
          </section>

          {/* Column Mapping */}
          {files.length > 0 && (
            <section>
              <ColumnMapper />
            </section>
          )}

          {/* Dashboard */}
          {files.length > 0 && files.every((f) => f.mapping) && (
            <>
              <section>
                <FiscalDashboard />
              </section>

              <section>
                <TransactionsTable />
              </section>
            </>
          )}

          {/* Instructions */}
          {files.length === 0 && (
            <section>
              <div className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto">
                <h2 className="text-base md:text-lg lg:text-xl font-semibold">How it works</h2>
                <div className="grid gap-3 md:gap-4 lg:gap-6 md:grid-cols-3 text-left">
                  <div className="p-4 md:p-5 lg:p-6 rounded-lg bg-card border">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3 text-sm md:text-base">
                      1
                    </div>
                    <h3 className="text-sm md:text-base font-medium mb-2">Upload CSV Files</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Upload transaction exports from your brokers
                    </p>
                  </div>
                  <div className="p-4 md:p-5 lg:p-6 rounded-lg bg-card border">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3 text-sm md:text-base">
                      2
                    </div>
                    <h3 className="text-sm md:text-base font-medium mb-2">Map Columns</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Confirm columns: dates, ISINs, quantities, prices
                    </p>
                  </div>
                  <div className="p-4 md:p-5 lg:p-6 rounded-lg bg-card border">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-3 text-sm md:text-base">
                      3
                    </div>
                    <h3 className="text-sm md:text-base font-medium mb-2">View Tax Report</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Get gains, losses, and tax with €10,000 exemption
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-6 md:mt-8 lg:mt-12 pt-4 md:pt-6 border-t text-center text-xs md:text-sm text-muted-foreground">
          <p>
            <strong>CapTrack BE</strong> - Built for Belgian investors opting out of withholding tax.
          </p>
          <p className="mt-1 md:mt-2">
            For informational purposes only. Consult a tax professional for official advice.
          </p>
        </footer>
      </div>
    </main>
  );
}
