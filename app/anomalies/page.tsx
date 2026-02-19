import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AnomaliesClient from "./anomalies-client";

export default async function AnomaliesPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Get or create sample anomalies for demo
  let anomalies = await prisma.anomaly.findMany({
    where: { userId },
    orderBy: { detectedAt: 'desc' }
  });
  
  // If no anomalies exist, create sample ones
  if (anomalies.length === 0) {
    const sampleAnomalies = [
      {
        userId,
        title: "AWS Bill Spike Detected",
        description: "Your AWS spending increased by 340% compared to last month. This could be due to increased usage or a configuration error.",
        severity: "high",
        status: "open",
        category: "spending_spike",
        amount: 12450,
        potentialSavings: 8500,
        aiConfidence: 0.95,
        aiRecommendation: "Review your EC2 instances for unused resources. Consider Reserved Instances for predictable workloads.",
      },
      {
        userId,
        title: "Duplicate Software Licenses",
        description: "Found 12 unused Zoom licenses across your organization. These were purchased but never assigned.",
        severity: "medium",
        status: "open",
        category: "duplicate",
        amount: 480,
        potentialSavings: 5760,
        aiConfidence: 0.98,
        aiRecommendation: "Remove unused licenses or reassign them to new team members. Consider annual billing for additional savings.",
      },
      {
        userId,
        title: "Unusual Weekend Transaction Pattern",
        description: "Multiple high-value transactions detected on weekends. This is unusual for your business pattern.",
        severity: "medium",
        status: "investigating",
        category: "unusual_pattern",
        amount: 3200,
        aiConfidence: 0.87,
        aiRecommendation: "Review these transactions for legitimacy. Consider implementing approval workflows for weekend transactions.",
      },
    ];
    
    for (const anomaly of sampleAnomalies) {
      await prisma.anomaly.create({ data: anomaly });
    }
    
    anomalies = await prisma.anomaly.findMany({
      where: { userId },
      orderBy: { detectedAt: 'desc' }
    });
  }
  
  const userSettings = await prisma.userSettings.findUnique({
    where: { userId }
  });
  
  return (
    <AnomaliesClient 
      anomalies={anomalies}
      currency={userSettings?.currency || 'USD'}
    />
  );
}