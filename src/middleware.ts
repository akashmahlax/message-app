import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

    // Public routes (accessible without authentication)
    const publicRoutes = ['/signin', '/signup', '/verify', '/']
    const isPublicRoute = publicRoutes.some(route => url.pathname.startsWith(route))

    // If user is not authenticated and tries to access protected route
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    // If user is authenticated and tries to access auth pages
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/signin',
        '/signup',
        '/',
        '/dashboard/:path*',
        '/verify/:path*',
    ]
}