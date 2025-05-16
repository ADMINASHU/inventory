import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
import { NextResponse } from "next/server";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prismaClient";
import bcrypt from "bcryptjs";

import {
  PUBLIC_ROUTES,
  LOGIN,
  PROTECTED_ROUTES,
  VERIFIED_ROUTES,
  UNAUTHORIZED,
} from "./lib/routes";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login", // Ensure this page exists and handles Google sign-in properly
    error: "/login", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
    revalidate: 1 * 60,
    updateAge: 1 * 60,
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;
        if (email && password) {
          const user = await prisma.users.findUnique({ where: { email } });
          if (user && user.password) {
            const isValidPassword = await bcrypt.compare(
              password,
              user.password
            );
            if (isValidPassword) {
              return user;
            }
          }
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          isAdmin: false,
          verified: true,
          fName: profile.given_name || profile.name || "User",
          eName: "",
          provider: "google",
          providerAccountId: profile.sub,
        };
      },
    }),
  ],
  callbacks: {
    // async signIn({ account, profile }) {
    //   if (account.provider === "google") {
    //     return profile.email_verified || false; // Ensure email is verified
    //   }
    //   return true;
    // },
    // async redirect({ url, baseUrl }) {
    //   // Ensure proper redirection to callbackUrl or baseUrl
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },
    authorized({ auth, request: { nextUrl } }) {
      const isAuthenticated = !!auth?.user;
      const isVerified = auth?.user?.verified;


      const isPublicRoute =
        PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) &&
        !PROTECTED_ROUTES.find((route) => nextUrl.pathname.includes(route));

      const isVerifiedRoute = VERIFIED_ROUTES.find((route) => nextUrl.pathname.startsWith(route));

    

      if (!isAuthenticated && !isPublicRoute) {
        return NextResponse.redirect(new URL(LOGIN, nextUrl));
      }

      if (isVerifiedRoute && !isVerified) {
        return NextResponse.redirect(new URL(UNAUTHORIZED, nextUrl));
      }
      return NextResponse.next();
    },
    jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin ?? false;
        token.verified = user.verified ?? false;
        token.fName = user.fName ?? user.name ?? "User";
        token.eName = user.eName ?? "";
        token.email = user.email;
        token.image = user.image;
        token.provider = user.provider ?? "credentials";
        token.providerAccountId = user.providerAccountId ?? "";
      }
      return token;
    },
    session({ session, token }) {
      session.user = token;
      return session;
    },
  },
});
