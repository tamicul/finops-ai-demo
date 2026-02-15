import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatCurrency, convertAmount } from "@/lib/currency/converter";
import { CurrencyCode, defaultCurrency } from "@/lib/currency/config";
import DashboardClient from "./dashboard-client";

export default async function Dashboard() {
  const { userId } = auth();
  
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
  
  // Create default financial data if not exists
  if (!financialData) {
    financialData = await prisma.financialData.create({
      data: {
        userId,
        cashBalance: 847290,
        monthlyBurn: 42350,
        runway: 20,
        monthlyRevenue: 67800
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
}