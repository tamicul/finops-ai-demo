import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const vendor = searchParams.get('vendor');
    
    const where: any = { userId };
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    
    if (type && type !== 'all') {
      where.type = type;
    }
    
    if (category && category !== 'all') {
      where.category = category;
    }
    
    if (vendor) {
      where.vendor = { contains: vendor, mode: 'insensitive' };
    }
    
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
    });
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
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
      name, description, category, amount, type, date,
      vendor, vendorType, paymentMethod, referenceNumber,
      status, tags
    } = body;
    
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        name,
        description,
        category,
        amount,
        type,
        date: new Date(date),
        vendor,
        vendorType,
        paymentMethod,
        referenceNumber,
        status: status || 'completed',
        tags: tags || [],
      }
    });
    
    // Update financial data aggregates
    const financialData = await prisma.financialData.findUnique({
      where: { userId }
    });
    
    if (financialData) {
      if (type === 'expense') {
        await prisma.financialData.update({
          where: { userId },
          data: { monthlyBurn: financialData.monthlyBurn + amount }
        });
      } else {
        await prisma.financialData.update({
          where: { userId },
          data: { monthlyRevenue: financialData.monthlyRevenue + amount }
        });
      }
    }
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { 
      id, name, description, category, amount, type, date,
      vendor, vendorType, paymentMethod, referenceNumber,
      status, tags
    } = body;
    
    const transaction = await prisma.transaction.update({
      where: { id, userId },
      data: {
        name,
        description,
        category,
        amount,
        type,
        date: new Date(date),
        vendor,
        vendorType,
        paymentMethod,
        referenceNumber,
        status,
        tags,
      }
    });
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
    }
    
    await prisma.transaction.delete({
      where: { id, userId }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}