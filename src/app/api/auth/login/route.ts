import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // 실제 환경에서는 데이터베이스에서 사용자를 확인해야 합니다.
  if (email === 'test@example.com' && password === 'password') {
    const token = generateToken('user123', 'student');
    const response = NextResponse.json({ token }, { status: 200 });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    });
    return response;
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
}