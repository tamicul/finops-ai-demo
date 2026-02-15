# FinOps AI - Deployment with Auth & Multi-Currency

## 🚀 Deployment with User Authentication

### Option 1: Clerk (Easiest - Recommended)

Clerk provides complete auth with pre-built UI components.

**1. Install Clerk:**
```bash
cd ~/.openclaw/workspace/finops-ai
npm install @clerk/nextjs
```

**2. Get API Keys:**
1. Go to https://dashboard.clerk.com
2. Create application
3. Copy Publishable Key and Secret Key

**3. Update Environment Variables:**
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database for user data
DATABASE_URL="postgresql://..."
```

**4. Create Middleware:**
```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

**5. Wrap App with Clerk:**
```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

**6. Add Sign-In/Sign-Up Pages:**
```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <SignIn />
    </div>
  );
}

// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <SignUp />
    </div>
  );
}
```

**7. Protect Dashboard:**
```typescript
// app/page.tsx
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = auth();
  const user = await currentUser();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <div>
      <h1>Welcome {user?.firstName}</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

---

### Option 2: Auth0 (Enterprise)

Better for enterprise SSO requirements.

**1. Install:**
```bash
npm install @auth0/nextjs-auth0
```

**2. Configure:**
```typescript
// app/api/auth/[auth0]/route.ts
import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();
```

**3. Environment Variables:**
```bash
AUTH0_SECRET='use [openssl rand -hex 32] to generate'
AUTH0_BASE_URL='https://your-domain.com'
AUTH0_ISSUER_BASE_URL='https://your-auth0-domain.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
```

---

### Option 3: NextAuth.js (Self-hosted)

Best if you want full control and don't want third-party services.

**1. Install:**
```bash
npm install next-auth
```

**2. Create API Route:**
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Verify against your database
        const user = await verifyUser(credentials);
        return user || null;
      }
    })
  ],
  pages: {
    signIn: "/sign-in",
  }
});

export { handler as GET, handler as POST };
```

---

## 💱 Multi-Currency Support

### 1. Database Schema Update

```sql
-- Add currency support to user settings
ALTER TABLE users ADD COLUMN preferred_currency VARCHAR(3) DEFAULT 'USD';
ALTER TABLE users ADD COLUMN timezone VARCHAR(50) DEFAULT 'America/New_York';

-- Add currency to transactions
ALTER TABLE transactions ADD COLUMN original_amount DECIMAL(12,2);
ALTER TABLE transactions ADD COLUMN original_currency VARCHAR(3);
ALTER TABLE transactions ADD COLUMN exchange_rate DECIMAL(10,6);
ALTER TABLE transactions ADD COLUMN converted_amount DECIMAL(12,2);

-- Exchange rates table
CREATE TABLE exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  rate DECIMAL(10,6) NOT NULL,
  fetched_at TIMESTAMP DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'open-exchange-rates',
  UNIQUE(from_currency, to_currency)
);
```

### 2. Currency Configuration

```typescript
// lib/currency/config.ts
export const currencies = {
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US', flag: '🇺🇸' },
  EUR: { symbol: '€', name: 'Euro', locale: 'de-DE', flag: '🇪🇺' },
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB', flag: '🇬🇧' },
  JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', flag: '🇯🇵' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', flag: '🇨🇦' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', flag: '🇦🇺' },
  CHF: { symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH', flag: '🇨🇭' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', flag: '🇨🇳' },
  INR: { symbol: '₹', name: 'Indian Rupee', locale: 'hi-IN', flag: '🇮🇳' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', flag: '🇧🇷' },
  ZAR: { symbol: 'R', name: 'South African Rand', locale: 'en-ZA', flag: '🇿🇦' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG', flag: '🇸🇬' },
  MXN: { symbol: '$', name: 'Mexican Peso', locale: 'es-MX', flag: '🇲🇽' },
  NGN: { symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG', flag: '🇳🇬' },
  KES: { symbol: 'KSh', name: 'Kenyan Shilling', locale: 'en-KE', flag: '🇰🇪' },
  GHS: { symbol: '₵', name: 'Ghanaian Cedi', locale: 'en-GH', flag: '🇬🇭' },
};

export type CurrencyCode = keyof typeof currencies;
export const defaultCurrency: CurrencyCode = 'USD';
```

### 3. Currency Conversion Service

```typescript
// lib/currency/converter.ts
import { currencies, CurrencyCode } from './config';

const EXCHANGE_API_KEY = process.env.EXCHANGE_API_KEY;
const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest';

export async function getExchangeRate(
  from: CurrencyCode,
  to: CurrencyCode
): Promise<number> {
  if (from === to) return 1;
  
  // Check cache first
  const cached = await getCachedRate(from, to);
  if (cached && isRateFresh(cached.fetched_at)) {
    return cached.rate;
  }
  
  // Fetch from API
  const response = await fetch(`${EXCHANGE_API_URL}/${from}`);
  const data = await response.json();
  
  const rate = data.rates[to];
  
  // Cache the rate
  await cacheRate(from, to, rate);
  
  return rate;
}

export async function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): Promise<{ converted: number; rate: number }> {
  const rate = await getExchangeRate(from, to);
  return {
    converted: amount * rate,
    rate
  };
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  locale?: string
): string {
  const config = currencies[currency];
  return new Intl.NumberFormat(locale || config.locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function formatCompactCurrency(
  amount: number,
  currency: CurrencyCode
): string {
  const config = currencies[currency];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

// Helper functions
async function getCachedRate(from: string, to: string) {
  // Query your database for cached rate
  const result = await prisma.exchangeRates.findUnique({
    where: { from_currency_to_currency: { from_currency: from, to_currency: to } }
  });
  return result;
}

function isRateFresh(fetchedAt: Date): boolean {
  const oneHour = 60 * 60 * 1000;
  return Date.now() - fetchedAt.getTime() < oneHour;
}

async function cacheRate(from: string, to: string, rate: number) {
  await prisma.exchangeRates.upsert({
    where: { from_currency_to_currency: { from_currency: from, to_currency: to } },
    update: { rate, fetched_at: new Date() },
    create: { from_currency: from, to_currency: to, rate }
  });
}
```

### 4. Currency Selector Component

```typescript
// components/currency-selector.tsx
"use client";

import { useState } from 'react';
import { currencies, CurrencyCode } from '@/lib/currency/config';
import { cn } from '@/lib/utils';

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = currencies[value];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg text-white text-sm hover:bg-zinc-700 transition-colors"
      >
        <span className="text-lg">{selected.flag}</span>
        <span>{value}</span>
        <span className="text-zinc-500">{selected.symbol}</span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
            {Object.entries(currencies).map(([code, config]) => (
              <button
                key={code}
                onClick={() => {
                  onChange(code as CurrencyCode);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors",
                  code === value && "bg-white/10"
                )}
              >
                <span className="text-xl">{config.flag}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{code}</p>
                  <p className="text-xs text-zinc-500">{config.name}</p>
                </div>
                <span className="text-zinc-400">{config.symbol}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

### 5. Update Dashboard to Use User's Currency

```typescript
// app/page.tsx
import { auth, currentUser } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import { formatCurrency, convertAmount } from "@/lib/currency/converter";
import { CurrencyCode, defaultCurrency } from "@/lib/currency/config";

export default async function Dashboard() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Get user's preferred currency
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId }
  });
  
  const userCurrency = (userSettings?.currency || defaultCurrency) as CurrencyCode;
  
  // Fetch financial data
  const financialData = await prisma.financialData.findFirst({
    where: { userId }
  });
  
  // Convert amounts if needed
  const displayBalance = userCurrency === 'USD' 
    ? financialData?.balance 
    : await convertAmount(financialData?.balance || 0, 'USD', userCurrency);
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <CurrencySelector 
          value={userCurrency}
          onChange={async (newCurrency) => {
            "use server";
            await prisma.userSettings.upsert({
              where: { userId },
              update: { currency: newCurrency },
              create: { userId, currency: newCurrency }
            });
          }}
        />
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(displayBalance, userCurrency)}
          change="+8.2%"
        />
        {/* Other stat cards */}
      </div>
    </div>
  );
}
```

### 6. Environment Variables for Production

```bash
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database
DATABASE_URL="postgresql://user:pass@your-db-host.com:5432/finops"

# Currency Exchange API
EXCHANGE_API_KEY="your-open-exchange-rates-api-key"
# Or use free alternative: https://open.er-api.com (no key needed)

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App URL
NEXT_PUBLIC_APP_URL="https://finops-ai-demo.vercel.app"
```

---

## 🌍 Regional Considerations

### Date/Time Formatting
```typescript
// lib/locale/dates.ts
export function formatDate(date: Date, locale: string, timezone: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(date);
}
```

### Number Formatting
```typescript
// Different countries use different decimal separators
export function formatNumber(num: number, locale: string) {
  return new Intl.NumberFormat(locale).format(num);
}
// 1,234.56 (US)
// 1.234,56 (Germany)
// 1 234,56 (France)
```

### Tax & Compliance
- **GDPR:** EU users need data export/deletion
- **PCI DSS:** If storing payment info
- **Local tax laws:** VAT, GST, sales tax calculations

---

## 📋 Deployment Checklist

### Pre-deployment:
- [ ] Set up Clerk/Auth0 account
- [ ] Create PostgreSQL database (Supabase/Railway)
- [ ] Get Exchange Rate API key
- [ ] Configure Stripe for payments
- [ ] Set up Sentry for error tracking

### Deployment:
```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Add environment variables in Vercel dashboard
# Project Settings → Environment Variables

# 3. Set up webhook endpoints
# Clerk: https://your-app.com/api/webhooks/clerk
# Stripe: https://your-app.com/api/webhooks/stripe
```

### Post-deployment:
- [ ] Test sign-up flow
- [ ] Test currency conversion
- [ ] Verify email sending
- [ ] Check database connections
- [ ] Monitor error logs

---

## 💰 Pricing by Region

Consider regional pricing:

```typescript
const regionalPricing = {
  'US': { starter: 49, growth: 149, enterprise: 499 },
  'EU': { starter: 45, growth: 135, enterprise: 450 },  // Slightly lower
  'IN': { starter: 15, growth: 45, enterprise: 150 },   // PPP adjusted
  'NG': { starter: 12, growth: 35, enterprise: 120 },   // PPP adjusted
  'BR': { starter: 18, growth: 55, enterprise: 180 },   // PPP adjusted
};
```

---

**Need help implementing any of this?** I can:
1. Set up Clerk authentication
2. Add multi-currency support to the dashboard
3. Create the database schema
4. Deploy to Vercel with all env vars