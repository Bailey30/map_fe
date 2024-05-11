import bcrypt from "bcrypt";
import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../lib/db";
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
      async authorize(credentials: any, _: any): Promise<any> {
        const { email, password, id } = credentials;
        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });
        if (!user) {
          return null;
        }
        const isValid = await bcrypt.compare(password as string, user.password);
        if (!isValid) {
          return null;
        }
        return {
          email: user.email,
          id: user.id,
          test: "ddf",
        };
      },
    }),
  ],
  callbacks: {
    // When using the Credentials Provider the user object is the response returned from the authorize callback and the profile object is the raw body of the HTTP POST submission.
    async signIn({ user, account }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("redirect called");
      // called after any redirect. Login causes a redirect
      if (url.includes("/login")) {
        return baseUrl;
      }
      return url;
    },
    async jwt({ token, account }) {
      console.log({ token });
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({
      token,
      session,
    }: {
      token: any;
      session: Session;
    }): Promise<Session> {
      if (token.sub && session.user) {
        session.user.id = parseInt(token.sub);
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {},
    async signOut() {},
  },
});
