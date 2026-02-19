import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  const user = await currentUser();
  const [financialData, userSettings] = await Promise.all([
    prisma.financialData.findUnique({ where: { userId } }),
    prisma.userSettings.findUnique({ where: { userId } })
  ]);
  
  return (
    <SettingsClient 
      user={{
        firstName: user?.firstName || '',
        email: user?.emailAddresses[0]?.emailAddress || '',
        has2FA: user?.twoFactorEnabled || false,
      }}
      financialData={financialData}
      currency={userSettings?.currency || 'USD'}
    />
  );
}