# Phytomax Site

Landing page and order flow for Phytomax, built with React + Vite and deployable on Vercel.

## Order backend

The order form is backed by Google Sheets through a Google Apps Script web app plus Vercel serverless functions:

- `GET /api/products` reads the live catalog and stock from the `Products` sheet through Apps Script
- `POST /api/order` validates the order, decrements stock, appends the order to the `Orders` sheet, and optionally sends notifications
- `GET /api/health` returns a lightweight deployment and integration healthcheck

Vercel keeps the public API surface stable for the frontend. Google Apps Script is the bridge that reads and writes the spreadsheet without service-account JSON keys.

## Google Sheets structure

Create a spreadsheet with these tabs and column layouts.

### `Products` sheet

Row 1 is for headers. Data starts on row 2.

| Column | Header | Notes |
| --- | --- | --- |
| A | `sku` | Unique product code |
| B | `productName` | Customer-facing name |
| C | `priceMUR` | Numeric price in MUR |
| D | `stock` | Integer stock count |
| E | `status` | Use `active` or `hidden` |
| F | `description` | Short product description |

### `Orders` sheet

Row 1 is for headers. Orders are appended automatically in this order:

`createdAt`, `orderId`, `productSku`, `productName`, `quantity`, `unitPriceMUR`, `totalPriceMUR`, `fullName`, `phone`, `email`, `deliveryAddress`, `juicePaymentConfirmation`, `notes`, `status`

CSV templates are included here:

- [templates/google-sheets-products.csv](./templates/google-sheets-products.csv)
- [templates/google-sheets-orders.csv](./templates/google-sheets-orders.csv)

## Google Apps Script setup

1. Create or open your Google Sheet.
2. Import the CSV templates into tabs named `Products` and `Orders`.
3. Open `Extensions -> Apps Script` from that spreadsheet.
4. Replace the default script with [templates/google-apps-script/Code.gs](./templates/google-apps-script/Code.gs).
5. In `Code.gs`, set `CONFIG.secret` to a long random value.
6. If the script is attached to the spreadsheet, leave `CONFIG.spreadsheetId` blank. If not, paste the spreadsheet ID there.
7. Deploy it as a web app:
   - `Deploy -> New deployment`
   - Type: `Web app`
   - Execute as: `Me`
   - Who has access: `Anyone`
8. Copy the web app URL.
9. Add the URL and same secret to Vercel env vars.

The Apps Script template uses a script lock so stock decrement and order append happen in one request instead of the older two-step flow.

## Environment variables

See [.env.example](./.env.example) for the full list.

Required:

- `GOOGLE_APPS_SCRIPT_URL`
- `GOOGLE_APPS_SCRIPT_SECRET`

Optional:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `RESEND_API_KEY`
- `ORDER_NOTIFICATION_EMAIL`
- `ORDER_FROM_EMAIL`
- `VITE_API_BASE_PATH` default: `/api`

## Notifications

- Telegram is the free notification path
- Resend email is optional and can run alongside Telegram

If neither is configured, orders still get stored in Google Sheets.

## Local development

The frontend can still be developed with `npm run dev`, but the Vercel API routes are best tested with `vercel dev` against a deployed Google Apps Script URL.

## Platform adapter layer

The API logic is now split into:

- platform-agnostic handlers in `server/handlers`
- transport adapters in `server/http.js`
- Vercel wrappers in `api/`
- Netlify wrappers in `netlify/functions/`
- Netlify deployment config in `netlify.toml`

Netlify is preconfigured to redirect `/api/*` to `/.netlify/functions/*`, so the frontend can keep using the default `/api` path after migration.

If you still want to override it explicitly, set:

```bash
VITE_API_BASE_PATH=/.netlify/functions
```

The core order and inventory logic stays the same.

## Build

```bash
npm run build
```
