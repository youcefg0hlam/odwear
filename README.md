# OD WEAR — Online clothing store

Vite + React + TypeScript storefront with a separate, Firebase-backed admin console.
Customers browse and order through WhatsApp without creating an account. Products,
orders, images, and admin authentication are handled by Firebase (free Spark plan).

## Features

- Public storefront — catalogue, search, cart, WhatsApp checkout. No login required.
- Separate admin console at `/?admin=1`, guarded by **Firebase Authentication**.
- Products and orders live in **Cloud Firestore** — shared across every device.
- Product photos are compressed and stored in **Firestore** documents, so every device shows the same image (no paid Storage bucket needed).
- Admin can add/remove products, adjust stock, and manage order statuses.
- Bilingual French / Arabic interface.

## Run locally

Requires Node.js 18+.

```bash
npm install
cp .env.example .env      # fill in your Firebase web config
npm run dev               # http://localhost:3000
```

If `.env` is missing, the app falls back to browser storage and the old admin access
code (`ODWEAR2026`, see `src/data/config.ts`) for local development only.

## Firebase setup (free, no payment required)

1. Create a project at https://console.firebase.google.com → **Add project**.
2. Enable **Authentication** → Sign-in method → **Email/Password**.
   Then create one user, e.g. `admin@odwear.store`, with a strong password.
3. Create **Firestore Database** → Create database → start in **production mode**.
4. Project settings → Your apps → Web app → copy the config values into `.env`.
5. Replace `REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID` in `.firebaserc` with your project ID.
6. Deploy (after installing the CLI with `npm i -g firebase-tools`):

```bash
npm run build
firebase login
firebase deploy
```

The first admin login automatically seeds the starter catalogue into Firestore if the
collection is empty. Security rules are in `firestore.rules`: the catalogue is public
read-only, customers can create orders, and only the designated admin email can modify
products or read orders. Firebase Storage is not used because it requires a paid plan;
compressed images are stored in Firestore instead.

## Live deployment

- Storefront: https://odwear-store.web.app
- Admin console: https://odwear-store.web.app/?admin=1
- Source: https://github.com/youcefg0hlam/odwear

The admin account is created in Firebase Authentication. Keep its password private;
it is intentionally not stored in this repository.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server on port 3000 |
| `npm run lint` | TypeScript type check |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
