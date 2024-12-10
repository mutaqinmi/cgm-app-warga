import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function middleware(req: NextRequest){
    // get the pathname of the request
    const pathname = req.nextUrl.pathname;

    // get the token from the cookie
    const cookie_user_token = req.cookies.get('user_token')?.value;

    // check if the token is not found
    if(!cookie_user_token){
        // If the token is not found, redirect to the signin page
        if(pathname.startsWith('/signin')) return NextResponse.next();
    }

    // fetch the token from the server
    try {
        const response = await axios.post(`${process.env.API_URL}/warga/auth`, {
            token: cookie_user_token
        });
        const { data } = response.data as { data: number };

        if(data === 0 || data === undefined){ 
            // If the token is not found, redirect to the signin page
            // return NextResponse.redirect(new URL('/signin', req.url));
            if (!pathname.startsWith('/signin')) {
                return NextResponse.redirect(new URL('/signin', req.url));
            }
            return NextResponse.next();
        }
        
        if (pathname.startsWith('/signin') && (data !== 0 || data !== undefined)){
            // If the token is not found, redirect to the signin page
            return NextResponse.redirect(new URL('/beranda', req.url));
        }

        return NextResponse.next();
    } catch (error) {
        if(pathname.startsWith('/')){    
            // If the token is not found, redirect to the signin page
            return NextResponse.redirect(new URL('/signin', req.url));
        }
        
        if (pathname.startsWith('/signin')){
            // If the token is not found, redirect to the signin page
            return NextResponse.redirect(new URL('/beranda', req.url));
        }
    }
}

export const config = {
    matcher: [
        '/beranda/:path*',
        '/iuran/:path*',
        '/settings/:path*',
        '/signin/:path*',
    ]
}