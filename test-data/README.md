# Test Data Files for CapTrack BE

This folder contains sample CSV files to test the Belgian tax calculator application.

## Available Test Files

### Simple Test Files (For Quick Testing)

#### small-gains-test.csv
**Purpose:** Test simple profit below exemption threshold
**Calculation:**
- Buy: 100 shares @ €100 = €10,000 + €10 fees
- Sell: 100 shares @ €180 = €18,000 - €10 fees
- **Gain:** €7,970
- **Taxable:** €0 (below €10,000 exemption)
- **Tax Due:** €0

#### large-gains-test.csv
**Purpose:** Test profit above exemption threshold
**Calculation:**
- Buy: 100 shares @ €100 + 50 shares @ €200 = €20,025
- Sell: 100 shares @ €250 + 50 shares @ €350 = €42,475
- **Gain:** €22,450
- **Taxable:** €12,450 (€22,450 - €10,000 exemption)
- **Tax Due:** €1,245 @ 10%

#### mixed-gains-losses-test.csv
**Purpose:** Test gains and losses offsetting
**Calculation:**
- Stock 1: Buy @ €150, Sell @ €200 = +€4,970 gain
- Stock 2: Buy @ €200, Sell @ €180 = -€1,020 loss
- Stock 3: Buy @ €100, Sell @ €130 = +€2,220 gain
- **Total Gains:** €7,190
- **Total Losses:** €1,020
- **Net Result:** €6,170
- **Taxable:** €0 (below €10,000 exemption)
- **Tax Due:** €0

---

### Real-World Test Files (For Complete Testing)

### 1. keytrade-transactions.csv
**Broker:** Keytrade Bank
**Format:** English column names
**Transactions:** 13 trades (8 buys, 5 sells)
**Securities:**
- BE0974293251 (Belgian stock)
- US0378331005 (Apple Inc.)
- NL0011794037 (ASML)
- FR0000120271 (Total Energies)
- DE0005140008 (Deutsche Bank)

**Expected Results:**
- Multiple partial sales with gains
- Tests FIFO calculation logic
- Mixed European and US stocks

### 2. bolero-transactions.csv
**Broker:** Bolero (KBC)
**Format:** French column names ("Achat/Vente")
**Transactions:** 10 trades (6 buys, 4 sells)
**Securities:**
- BE0003565737 (Belgian stock)
- LU0378434582 (Luxembourg fund)
- IE00B4L5Y983 (Irish ETF)
- NL0000009355 (ASML)

**Expected Results:**
- Tests French language detection
- Mix of gains and losses
- Tests ETF and fund transactions

### 3. degiro-transactions.csv
**Broker:** Degiro
**Format:** Dutch column names ("Koop/Verkoop")
**Transactions:** 12 trades (6 buys, 6 sells)
**Securities:**
- US88160R1014 (Tesla)
- US0231351067 (Amazon)
- NL0010273215 (Dutch stock)
- FR0000131104 (BNP Paribas)
- DE000A1EWWW0 (Adidas)

**Expected Results:**
- Tests Dutch language detection
- High-value transactions (good for testing €10,000 exemption)
- Mix of gains and losses

## How to Use

1. **Single File Test:** Upload one file to test basic functionality
2. **Multi-File Test:** Upload all three files together to test:
   - Multi-broker consolidation
   - Different CSV formats
   - Language detection (English/French/Dutch)
   - Combined P&L across brokers

## Column Mapping Expected

The app should auto-detect these mappings:

**Keytrade:**
- Date → Date
- ISIN → ISIN
- Transaction Type → Direction
- Quantity → Quantity
- Price per Share → Price
- Fees → Fees

**Bolero:**
- Trade Date → Date
- Security Code → ISIN
- Direction → Direction (Achat/Vente)
- Shares → Quantity
- Unit Price → Price
- Transaction Costs → Fees

**Degiro:**
- Datum → Date
- ISIN Code → ISIN
- Type → Direction (Koop/Verkoop)
- Aantal → Quantity
- Koers → Price
- Kosten → Fees

## Expected Tax Calculation (Approximate)

When all three files are uploaded together:
- **Total Capital Gains:** ~€15,000 - €20,000
- **Total Capital Losses:** ~€1,000 - €2,000
- **Net Result:** ~€14,000 - €18,000
- **Taxable Amount:** ~€4,000 - €8,000 (after €10,000 exemption)
- **Estimated Tax (10%):** ~€400 - €800

*Note: Exact amounts depend on FIFO calculation of partial sales*

## Testing Privacy

All files are processed entirely in your browser. You can:
1. Disconnect from internet after loading the page
2. Upload files and verify calculations still work
3. Confirm no network requests are made (check browser DevTools)
