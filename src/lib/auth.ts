import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { Session } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-it';

export function signToken(payload: { userId: string; username: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    return jwt.verify(token, JWT_SECRET) as Session;
  } catch (err) {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
