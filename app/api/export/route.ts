import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const financialData = await prisma.financialData.findFirst({
      where: { userId }
    });
    
    if (!financialData) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }
    
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId }
    });
    
    // Create CSV content
    const csv = [
      ['Metric', 'Value'],
      ['Cash Balance', financialData.cashBalance.toString()],
      ['Monthly Burn', financialData.monthlyBurn.toString()],
      ['Monthly Revenue', financialData.monthlyRevenue.toString()],
      ['Runway (months)', financialData.runway.toString()],
      ['Currency', userSettings?.currency || 'USD'],
      ['Exported At', new Date().toISOString()],
    ].map(row => row.join(',')).join('\n');
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=financial-report.csv',
      },
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 });
  }
}