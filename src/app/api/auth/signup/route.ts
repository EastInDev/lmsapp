import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json();

  // 여기에 실제 데이터베이스 저장 로직이 들어갑니다.
  // 지금은 간단히 콘솔에 출력만 하겠습니다.
  console.log('New user:', { name, email, role });

  // 실제로는 여기서 비밀번호 해싱, 데이터베이스 저장 등의 작업을 수행해야 합니다.

  return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
}