import { auth } from "./lib/auth"
import { authConfig } from "./lib/auth.config";
import NextAuth from "next-auth" 

// https://authjs.dev/reference/nextjs#in-middleware
// next-auth can be used in middleware and checks authentication using the "authorized()" callback in the NextAuthConfig that is passed to NextAuth
// middleware.ts requires something to be returned in order to work
// returning the "auth" method from NextAuth enables this
// the documentation suggests returning "export {auth as middleware} from "./lib/auth"" but this causes an error
// here we essentially return a new NextAuth, different from the one in "./lib/auth", but handles the responsibilties of middleware
export default NextAuth(authConfig).auth

// causes the middleware to run on every route
export const config = {
    matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};
