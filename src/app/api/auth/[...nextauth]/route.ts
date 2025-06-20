import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
        console.log("🔐 Attempting to authorize with:", credentials);

        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          console.log("✅ Authorization successful!");
          return {
            id: "1",
            name: "Test User",
            email: "user@example.com",
          }
        }
        
        console.log("❌ Authorization failed.");
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export const GET = handlers.GET
export const POST = handlers.POST
