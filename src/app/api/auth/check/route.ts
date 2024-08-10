import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (token && verifyToken(token)) {
    return NextResponse.json({ isLoggedIn: true }, { status: 200 });
  } else {
    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  }
}