import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const anomalies = await prisma.anomaly.findMany({
      where: { userId },
      orderBy: { detectedAt: 'desc' },
    });
    
    return NextResponse.json(anomalies);
  } catch (error) {
    console.error('Error fetching anomalies:', error);
    return NextResponse.json({ error: 'Failed to fetch anomalies' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { id, status } = body;
    
    const updateData: any = { status };
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    }
    
    const anomaly = await prisma.anomaly.update({
      where: { id, userId },
      data: updateData
    });
    
    return NextResponse.json(anomaly);
  } catch (error) {
    console.error('Error updating anomaly:', error);
    return NextResponse.json({ error: 'Failed to update anomaly' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const {
      title, description, severity, category,
      amount, potentialSavings, aiConfidence, aiRecommendation
    } = body;
    
    const anomaly = await prisma.anomaly.create({
      data: {
        userId,
        title,
        description,
        severity,
        category,
        amount,
        potentialSavings,
        aiConfidence,
        aiRecommendation,
        status: 'open',
      }
    });
    
    return NextResponse.json(anomaly);
  } catch (error) {
    console.error('Error creating anomaly:', error);
    return NextResponse.json({ error: 'Failed to create anomaly' }, { status: 500 });
  }
}