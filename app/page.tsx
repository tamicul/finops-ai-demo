import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatCurrency, convertAmount } from "@/lib/currency/converter";
import { CurrencyCode, defaultCurrency } from "@/lib/currency/config";
import DashboardClient from "./dashboard-client";

export default async function Dashboard() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  const user = await currentUser();
  
  // Get user's preferred currency
  let userSettings = await prisma.userSettings.findUnique({
    where: { userId }
  });
  
  // Create default settings if not exists
  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId,
        currency: defaultCurrency,
        timezone: "America/New_York"
      }
    });
  }
  
  const userCurrency = (userSettings.currency || defaultCurrency) as CurrencyCode;
  
  // Get financial data
  let financialData = await prisma.financialData.findFirst({
    where: { userId }
  });
  
  // Create randomized demo data if not exists
  if (!financialData) {
    // Generate unique demo data for each user
    const randomBalance = Math.floor(Math.random() * 900000) + 100000; // 100k to 1M
    const randomBurn = Math.floor(Math.random() * 80000) + 20000; // 20k to 100k
    const randomRevenue = Math.floor(Math.random() * 150000) + 30000; // 30k to 180k
    const randomRunway = Math.floor(Math.random() * 24) + 6; // 6 to 30 months
    
    financialData = await prisma.financialData.create({
      data: {
        userId,
        cashBalance: randomBalance,
        monthlyBurn: randomBurn,
        runway: randomRunway,
        monthlyRevenue: randomRevenue
      }
    });
  }
  
  // Convert amounts to user's preferred currency
  const exchangeRate = userCurrency === 'USD' ? 1 : await convertAmount(1, 'USD', userCurrency).then(r => r.rate);
  
  const convertedData = {
    cashBalance: financialData.cashBalance * exchangeRate,
    monthlyBurn: financialData.monthlyBurn * exchangeRate,
    monthlyRevenue: financialData.monthlyRevenue * exchangeRate,
    runway: financialData.runway,
    exchangeRate
  };
  
  return (
    <DashboardClient 
      user={{ 
        firstName: user?.firstName || 'User',
        email: user?.emailAddresses[0]?.emailAddress 
      }}
      currency={userCurrency}
      financialData={convertedData}
    />
  );
}// build Wed Feb 18 22:56:37 EST 2026
