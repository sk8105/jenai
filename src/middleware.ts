import { NextResponse, NextRequest } from 'next/server';
import { getAuthToken } from '@/lib/cookies';

export function middleware(request: NextRequest) {
    console.log('Middleware triggered');
    const token = getAuthToken();
    console.log(`Token: ${token}`);
  
    if (!token && request.nextUrl.pathname !== '/login') {
      console.log('Redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  
    return NextResponse.next();
  }

export const config = {
    matcher: ['/dashboard/:path*', '/file-upload/:path*', '/chat/:path*' , '/login'],
};