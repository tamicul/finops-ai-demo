# 🚀 Deploy FinOps AI to Vercel (Step-by-Step)

## Prerequisites
- Vercel account (you have this: https://vercel.com/tambo-consult)
- GitHub account (to push the code)
- Clerk account (for authentication)

---

## Step 1: Push Code to GitHub

### 1.1 Create a GitHub Repository
1. Go to https://github.com/new
2. Name it `finops-ai-demo`
3. Make it **Public** (for easier deployment)
4. Click "Create repository"

### 1.2 Push Your Code

Open terminal in the project folder:

```bash
cd ~/.openclaw/workspace/finops-ai

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - FinOps AI with auth and multi-currency"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/finops-ai-demo.git

# Push
git push -u origin main
```

---

## Step 2: Set Up Clerk (Authentication)

### 2.1 Create Clerk Application
1. Go to https://dashboard.clerk.com
2. Sign up with your Google account (same as Vercel)
3. Click "Create Application"
4. Name: "FinOps AI"
5. Select sign-in methods:
   - ✅ Email
   - ✅ Google (recommended)
   - ✅ GitHub (optional)
6. Click "Create"

### 2.2 Get API Keys
1. In Clerk dashboard, go to "API Keys"
2. Copy these values:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

Save these for Step 4!

---

## Step 3: Deploy to Vercel

### 3.1 Import Project
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Find and select `finops-ai-demo`
4. Click "Import"

### 3.2 Configure Project
- **Project Name:** finops-ai-demo
- **Framework Preset:** Next.js (should auto-detect)
- **Root Directory:** ./

### 3.3 Add Environment Variables
Click "Environment Variables" and add these:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_...
CLERK_SECRET_KEY = sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL = /
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL = /
DATABASE_URL = (leave empty for now)
NEXT_PUBLIC_APP_URL = (will be https://finops-ai-demo.vercel.app)
```

### 3.4 Deploy
Click **"Deploy"**

Wait 2-3 minutes for deployment to complete.

---

## Step 4: Set Up Database (Vercel Postgres)

### 4.1 Create Database
1. In Vercel dashboard, go to your project
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Vercel Postgres"
5. Region: Select closest to you
6. Click "Create"

### 4.2 Connect Database
1. In the database dashboard, click ".env.local"
2. Copy the `POSTGRES_URL` or `DATABASE_URL`
3. Go back to your project → Settings → Environment Variables
4. Add new variable:
   - Name: `DATABASE_URL`
   - Value: (paste the URL from step 2)
5. Click "Save"

### 4.3 Run Database Migration
In your terminal:

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Pull environment variables
vercel env pull

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

---

## Step 5: Configure Clerk Webhook (Important!)

### 5.1 Add Webhook Endpoint
1. In Clerk dashboard, go to "Webhooks"
2. Click "Add Endpoint"
3. URL: `https://finops-ai-demo.vercel.app/api/webhooks/clerk`
4. Select events:
   - ✅ user.created
   - ✅ user.updated
5. Click "Create"
6. Copy the **Signing Secret**

### 5.2 Add Webhook Secret to Vercel
1. Go to Vercel project → Settings → Environment Variables
2. Add:
   - Name: `CLERK_WEBHOOK_SECRET`
   - Value: (paste signing secret from step 5.1)
3. Click "Save"

### 5.3 Redeploy
In Vercel dashboard:
1. Go to "Deployments"
2. Find latest deployment
3. Click "Redeploy"

---

## Step 6: Test Your App

### 6.1 Visit Your App
URL: `https://finops-ai-demo.vercel.app`

### 6.2 Test Authentication
1. Click "Sign In"
2. Sign up with Google or email
3. You should see the dashboard with your name

### 6.3 Test Multi-Currency
1. Look for currency selector (top right)
2. Click and select different currency (e.g., EUR, GBP, NGN)
3. All amounts should convert automatically

---

## 🌍 Supported Currencies

Users can select from:
- 🇺🇸 USD (US Dollar) - Default
- 🇪🇺 EUR (Euro)
- 🇬🇧 GBP (British Pound)
- 🇯🇵 JPY (Japanese Yen)
- 🇨🇦 CAD (Canadian Dollar)
- 🇦🇺 AUD (Australian Dollar)
- 🇨🇭 CHF (Swiss Franc)
- 🇨🇳 CNY (Chinese Yuan)
- 🇮🇳 INR (Indian Rupee)
- 🇧🇷 BRL (Brazilian Real)
- 🇿🇦 ZAR (South African Rand)
- 🇸🇬 SGD (Singapore Dollar)
- 🇲🇽 MXN (Mexican Peso)
- 🇳🇬 NGN (Nigerian Naira)
- 🇰🇪 KES (Kenyan Shilling)
- 🇬🇭 GHS (Ghanaian Cedi)

---

## 🔒 Security Features

- ✅ Authentication required to view dashboard
- ✅ User data isolated per account
- ✅ Secure database connections
- ✅ Environment variables encrypted
- ✅ Webhook signature verification

---

## 📱 Sharing with Others

Once deployed, you can share:

```
🎉 FinOps AI is live!

Try it here: https://finops-ai-demo.vercel.app

Features:
• User authentication (sign up with Google)
• Financial dashboard with real-time data
• Multi-currency support (16 currencies!)
• Cash flow forecasting
• AI-powered spending alerts

Built by Tambo Consulting LLC
```

---

## 🐛 Troubleshooting

### Issue: "Database connection failed"
**Solution:** 
1. Check DATABASE_URL in Vercel env variables
2. Run `npx prisma db push` again
3. Make sure database is in "running" state

### Issue: "Clerk authentication not working"
**Solution:**
1. Verify API keys are correct
2. Check Clerk dashboard for allowed origins
3. Add your Vercel URL to Clerk's "Allowed Origins"

### Issue: "Currency not converting"
**Solution:**
- Exchange rates API is free and doesn't require key
- Check browser console for errors
- May need to refresh page after currency change

### Issue: "Build failed"
**Solution:**
1. Check Vercel deployment logs
2. Make sure all dependencies in package.json
3. Run `npm run build` locally to test

---

## 📝 Next Steps

1. **Customize branding** - Update colors, logo in components
2. **Add more features** - Expenses page, Reports, Settings
3. **Connect real bank** - Add Plaid integration
4. **Add Stripe billing** - Charge users for premium features
5. **Mobile app** - Build React Native version

---

## 💬 Support

If you get stuck:
1. Check Vercel deployment logs
2. Review Clerk documentation: https://clerk.com/docs
3. Check Prisma documentation: https://prisma.io/docs

**Good luck! Your FinOps AI will be live in 10 minutes! 🚀**