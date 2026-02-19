import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import TransactionsClient from "./transactions-client";

export default async function TransactionsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  const [userSettings, transactions] = await Promise.all([
    prisma.userSettings.findUnique({ where: { userId } }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 100
    })
  ]);
  
  return (
    <TransactionsClient 
      transactions={transactions}
      currency={userSettings?.currency || 'USD'}
    />
  );
}