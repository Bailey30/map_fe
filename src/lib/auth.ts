import bcrypt from "bcrypt"
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../lib/db"
import { authConfig } from "./auth.config";
import { redirect } from "next/navigation";

// https://authjs.dev/guides/upgrade-to-v5
// https://authjs.dev/reference/nextjs
// https://authjs.dev/reference/nextjs#nextauthconfig
// npm i next-auth@beta
export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        CredentialsProvider({
            // this is to login in a previously created user
            async authorize(credentials: any, req: any) {
                console.log("calling authorize")
                const { email, password } = credentials;
                console.log({ email, password })
                const user = await prisma.user.findFirst({
                    where: {
                        email: email
                    }
                })
                if (!user) {
                    console.log("returning null, !user")
                    return null
                }
                const isValid = bcrypt.compare(
                    password as string, user.password
                )
                if (!isValid) {
                    console.log("retuning null, !valid")
                    return null
                }
                console.log("returning user")
                return user
            }
        })
    ],
    callbacks: { 
      
        // When using the Credentials Provider the user object is the response returned from the authorize callback and the profile object is the raw body of the HTTP POST submission.
        async signIn({ user, account }) {
            console.log("sign in callback")
            console.log(user, account)
            return true
        },
        async redirect({url, baseUrl}){
            console.log("redirect callbac")
            // called after any redirect. Login causes a redirect
            console.log({baseUrl, url})
            if (url.includes("/login")){
                return baseUrl
            }
            return url
        }
    },
    events: {
        async signIn({ user, account }) {
            console.log("sign in event")
            console.log(user, account)
        },
        async signOut(){
            console.log("sign out event")
        }
    }
})
