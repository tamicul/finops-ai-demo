import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import CashFlowClient from "./cashflow-client";

export default async function CashFlowPage() {
  const { userId } = auth();
  
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
    <CashFlowClient 
      financialData={financialData}
      currency={userSettings?.currency || 'USD'}
    />
  );
}