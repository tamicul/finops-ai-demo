import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { 
      cashBalance, monthlyBurn, monthlyRevenue, runway, currency,
      businessName, businessType, industry, location, foundedYear, employeeCount, website
    } = body;
    
    // Update currency preference
    await prisma.userSettings.upsert({
      where: { userId },
      update: { 
        currency,
        businessName,
        businessType,
        industry,
        location,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        employeeCount: employeeCount ? parseInt(employeeCount) : null,
        website,
      },
      create: {
        userId,
        currency,
        timezone: 'America/New_York',
        businessName,
        businessType,
        industry,
        location,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        employeeCount: employeeCount ? parseInt(employeeCount) : null,
        website,
      }
    });
    
    // Update financial data
    await prisma.financialData.upsert({
      where: { userId },
      update: {
        cashBalance,
        monthlyBurn,
        monthlyRevenue,
        runway,
      },
      create: {
        userId,
        cashBalance,
        monthlyBurn,
        monthlyRevenue,
        runway,
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}