import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        const sessionCookie = request.cookies.get('laravel_session') || request.cookies.get('laravel-session') || request.cookies.get('api-moviekita-session')

        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/dashboard/:path*',
}
