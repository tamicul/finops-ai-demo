import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  const user = await currentUser();
  
  const financialData = await prisma.financialData.findFirst({
    where: { userId }
  });
  
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId }
  });
  
  return (
    <SettingsClient 
      user={{
        firstName: user?.firstName || 'User',
        email: user?.emailAddresses[0]?.emailAddress
      }}
      financialData={financialData}
      currency={userSettings?.currency || 'USD'}
    />
  );
}