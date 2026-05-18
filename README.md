# WalForms 🦭

Walrus-native feedback and form platform. Collect structured feedback directly on-chain with custom forms, Seal encryption, and an admin dashboard.

Built for [Walrus Sessions: Tools Builder Activation](https://www.deepsurge.xyz/hackathons/c2c48b38-33a7-405c-922b-a3be2ad25158).

## What it does

WalForms lets teams and communities collect structured feedback stored on Walrus. Form creators build custom forms with multiple field types, share a link, and review submissions through a private admin dashboard.

**Form builder**
- 8 field types: short text, rich text, dropdown, checkboxes, star rating, file upload, URL, confirmation
- Mark fields as required or optional
- Toggle Seal encryption per form (only admins can read responses)
- Shareable form links

**Admin dashboard**
- Filter and search submissions
- Set priority (high/medium/low) per response
- Add internal notes
- Export data as CSV
- Delete submissions

**Storage**
- All form definitions and submissions stored on Walrus blobs
- Sensitive data encrypted with Seal so only the form creator and approved admins can decrypt

## Stack

- React + Vite
- Walrus blob storage (publisher API)
- Seal encryption for private forms
- Space Grotesk + JetBrains Mono typography

## Run locally

```
npm install
npm run dev
```

Open http://localhost:5173

## Build

```
npm run build
```

Output goes to `dist/`. Deploy to Walrus Sites:

```
walrus site publish ./dist
```

## Deploy to Vercel

```
npx vercel
```

## Screenshots

See the demo video for a full walkthrough of the form builder, public form view, and admin dashboard.

## License

MIT
