# CapTrack BE

A clean and elegant financial reporting tool for calculating Belgian capital gains tax on stock trading with privacy-first, client-side processing.

## Features

- **Privacy First**: All CSV processing happens in your browser. No data is sent to any server.
- **Multi-Broker Support**: Import CSV files from multiple brokers (Keytrade, Bolero, Degiro, etc.)
- **Smart Column Mapping**: Intelligent detection of CSV columns with manual confirmation
- **Fiscal Dashboard**: Real-time calculation of:
  - Total Capital Gains
  - Total Capital Losses
  - Net Result (P&L)
  - Taxable Amount (after €10,000 exemption)
  - Estimated Tax Due (adjustable tax rate, default 10%)
- **Detailed Transactions**: Sortable and filterable table of all transactions
- **Export Functionality**: Export transactions to CSV for record-keeping

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **CSV Parsing**: PapaParse
- **Icons**: Lucide React

## Getting Started

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## How to Use

1. **Upload CSV Files**
   - Drag and drop or click to upload CSV files from your brokers
   - Multiple files can be uploaded simultaneously

2. **Map Columns**
   - For each file, confirm which columns contain:
     - Date (required)
     - ISIN (required)
     - Direction/Type (Buy/Sell) (required)
     - Quantity (required)
     - Price (required)
     - Fees (optional)

3. **View Tax Report**
   - Dashboard shows your capital gains, losses, and estimated tax
   - Adjust the tax rate if needed (default: 10%)
   - €10,000 exemption is automatically applied

4. **Export Results**
   - Export transaction details to CSV for your records
   - Use the data for your tax declaration

## Belgian Tax Context

In Belgium, investors can opt-out of withholding tax and declare capital gains themselves to benefit from:
- Deduction of capital losses from gains
- €10,000 exemption threshold on net gains

This tool helps calculate your tax obligation accurately using FIFO (First In, First Out) methodology.

## Privacy & Security

- All CSV parsing and calculations happen in your browser
- No data is stored on any server
- No database or backend API
- Completely client-side application

## Deployment

Deploy easily to Vercel:

```bash
npm install -g vercel
vercel
```

Or use any static hosting service since this is a client-side only application.

## License

For informational purposes only. Consult a tax professional for official advice.
