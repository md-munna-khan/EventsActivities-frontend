/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { serverFetch } from '@/lib/server-fetch';

export async function POST() {
  try {
    const response = await serverFetch.post('/auth/apply-host');
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error: any) {
    console.error('API /api/host/apply error', error);
    return NextResponse.json({ success: false, message: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
