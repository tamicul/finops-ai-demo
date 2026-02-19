import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AnomaliesClient from "./anomalies-client";

export default async function AnomaliesPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId }
  });
  
  return (
    <AnomaliesClient 
      currency={userSettings?.currency || 'USD'}
    />
  );
}