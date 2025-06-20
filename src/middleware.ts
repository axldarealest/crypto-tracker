import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Allow public access to crypto APIs
  if (request.nextUrl.pathname.startsWith('/api/ethereum') || 
      request.nextUrl.pathname.startsWith('/api/bitcoin') ||
      request.nextUrl.pathname.startsWith('/api/coingecko')) {
    return NextResponse.next()
  }

  // For other routes, continue with normal processing
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 