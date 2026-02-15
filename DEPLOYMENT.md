# FinOps AI - Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

Vercel is the fastest way to deploy your Next.js app with a free domain.

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project directory:**
   ```bash
   cd ~/.openclaw/workspace/finops-ai
   vercel
   ```

4. **Follow the prompts** - Vercel will detect Next.js and deploy automatically.

5. **Get your URL** - something like `https://finops-ai-demo.vercel.app`

### Option 2: Deploy via GitHub + Vercel

1. **Create a GitHub repository** (e.g., `finops-ai-demo`)

2. **Push the code:**
   ```bash
   cd ~/.openclaw/workspace/finops-ai
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/finops-ai-demo.git
   git push -u origin main
   ```

3. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/in with GitHub
   - Click "Add New Project"
   - Import your `finops-ai-demo` repo
   - Deploy!

### Option 3: Deploy via Vercel Web Interface

1. Go to [vercel.com/new](https://vercel.com/new)
2. Upload your project folder as a ZIP file
3. Vercel will auto-detect Next.js and deploy

---

## 🌐 Alternative: Deploy to Netlify

### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
cd ~/.openclaw/workspace/finops-ai
npm run build

# Deploy
netlify deploy --prod --dir=out
```

### Via Netlify Web

1. Build locally:
   ```bash
   npm run build
   ```

2. Go to [netlify.com](https://netlify.com)

3. Drag and drop the `out` folder to deploy

---

## 📋 Pre-Deployment Checklist

- [ ] Update `next.config.js` for static export (already done)
- [ ] Test build locally: `npm run build`
- [ ] Add your domain to metadata in `layout.tsx`
- [ ] Update OpenGraph image if needed
- [ ] Set environment variables in Vercel dashboard (if using APIs)

---

## ⚙️ Environment Variables (Optional)

If you add real APIs later, set these in Vercel:

```
NEXT_PUBLIC_API_URL=your_api_url
PLAID_CLIENT_ID=your_plaid_id
STRIPE_PUBLIC_KEY=your_stripe_key
```

---

## 🔄 Automatic Deployments

With GitHub + Vercel:
- Every push to `main` branch auto-deploys
- Preview deployments for pull requests
- Custom domains supported (add in Vercel settings)

---

## 📱 Custom Domain Setup

1. In Vercel dashboard, go to Project Settings → Domains
2. Add your domain (e.g., `demo.tamboconsulting.com`)
3. Follow DNS configuration instructions
4. SSL certificate auto-provisioned

---

## 🎨 Branding Checklist

- [ ] Logo: Custom SVG hexagon with F + AI dot
- [ ] Copyright: Tambo Consulting LLC © 2025
- [ ] Colors: Emerald (#10b981) to Cyan (#06b6d4) gradient
- [ ] Favicon: Matches logo

---

## 📊 Analytics (Optional)

Add to `layout.tsx` for tracking:

```tsx
// Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>

// Or Vercel Analytics (built-in)
import { Analytics } from '@vercel/analytics/react';
```

---

## 🆘 Troubleshooting

**Build fails?**
- Check `next.config.js` has `output: 'export'`
- Ensure all imports are correct

**Images not loading?**
- Use Next.js `<Image>` with `unoptimized` for static export
- Or use standard `<img>` tags

**Fonts not loading?**
- Inter font is included via Google Fonts in layout.tsx

---

## 📞 Support

For deployment issues:
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)

---

**© 2025 Tambo Consulting LLC - All rights reserved**