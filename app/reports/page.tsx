import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ReportsClient from "./reports-client";

export default async function ReportsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  const [userSettings, transactions, financialData] = await Promise.all([
    prisma.userSettings.findUnique({ where: { userId } }),
    prisma.transaction.findMany({ where: { userId } }),
    prisma.financialData.findUnique({ where: { userId } })
  ]);
  
  return (
    <ReportsClient 
      currency={userSettings?.currency || 'USD'}
      transactions={transactions}
      financialData={financialData}
    />
  );
}