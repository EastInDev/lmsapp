import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: '1d' });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, SECRET_KEY) as { userId: string; role: string };
  } catch (error) {
    return null;
  }
}