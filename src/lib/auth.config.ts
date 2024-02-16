// handles next-auth logic associated with middleware
// is passed into NextAuth() in middleware.ts

import next from "next"
import { NextURL } from "next/dist/server/web/next-url"
import { NextResponse } from "next/server"

const requiresAuthRoutes = ["/review", "/test"]
const alreadySignedIn = ["/login", "/register"]
export const authConfig: any = {
    pages: {
        // make it redirect to your own defined routes instead of the auto generated next-auth ones
        signIn: "/login",
        register: "/register"
    },
    callbacks: {
        async authorized({ auth, request: { nextUrl } }: any) {
            console.log("authorized callback")
            const isLoggedIn = !!auth?.user
            console.log(auth)
            if (!isLoggedIn) {
                // return false if they are on any of the routes that require auth
                return !requiresAuthRoutes.some((route) => nextUrl.pathname === route)
            }
            if (isLoggedIn) {
                if (alreadySignedIn.some((route: string) => nextUrl.pathname.startsWith(route))) {
                    console.log(nextUrl)
                    return NextResponse.redirect(nextUrl.origin)
                }
            }
            // return true to say it is authorized to be on this page
            // return false to redirect to login page
            return true


        }
    },
    providers: [] // need this even if its empty to prevent error
} 
