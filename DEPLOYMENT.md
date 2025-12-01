# CapTrack BE - Deployment Guide

## Quick Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel
```

Follow the prompts to deploy. Vercel will automatically:
- Detect Next.js framework
- Build the application
- Deploy to production
- Provide a URL (e.g., `captrack-be.vercel.app`)

## Environment Setup

No environment variables needed! Everything runs client-side.

## Build Commands

- **Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Start Production**: `npm start`

## Important Notes

- All processing is client-side (privacy-first)
- No database or backend required
- No API keys or secrets needed
- Can be deployed to any static hosting (Vercel, Netlify, etc.)

## Custom Domain

After deploying to Vercel:
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., `captrack.be`)

## Performance

- Static site generation for instant loading
- Optimized bundle size
- All calculations happen in browser
- No server costs or scaling concerns
