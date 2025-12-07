/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { serverFetch } from '@/lib/server-fetch';

export async function GET() {
  try {
    const response = await serverFetch.get('/auth/me');
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    console.error('API /api/auth/me error', error);
    return NextResponse.json({ success: false, message: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
