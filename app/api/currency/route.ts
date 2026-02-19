import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { currency } = body;
    
    if (!currency) {
      return NextResponse.json({ error: 'Currency required' }, { status: 400 });
    }
    
    await prisma.userSettings.upsert({
      where: { userId },
      update: { currency },
      create: {
        userId,
        currency,
        timezone: 'America/New_York'
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving currency:', error);
    return NextResponse.json({ error: 'Failed to save currency' }, { status: 500 });
  }
}