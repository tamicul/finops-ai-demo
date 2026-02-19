import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ExpensesClient from "./expenses-client";

export default async function ExpensesPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  const financialData = await prisma.financialData.findFirst({
    where: { userId }
  });
  
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId }
  });
  
  return (
    <ExpensesClient 
      monthlyBurn={financialData?.monthlyBurn || 42350}
      currency={userSettings?.currency || 'USD'}
    />
  );
}