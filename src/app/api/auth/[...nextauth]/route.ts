import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyUser } from "@/lib/database"

const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await verifyUser({
            email: credentials.email as string,
            password: credentials.password as string
          });

          if (user) {
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
    signOut: '/',
  },
  trustHost: true // Important pour Vercel
}

const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export const GET = handlers.GET
export const POST = handlers.POST
