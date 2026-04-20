import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

// Simple in-memory user store (replace with DB later)
const users: Array<{ id: string; name: string; email: string; password: string; phone?: string; createdAt: string }> = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@privatefireapp.com',
    password: 'demo1234',
    phone: '818-555-0100',
    createdAt: new Date().toISOString(),
  },
]

export function findUserByEmail(email: string) {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function createUser(data: { name: string; email: string; password: string; phone?: string }) {
  const existing = findUserByEmail(data.email)
  if (existing) return null
  const user = { id: String(users.length + 1), ...data, createdAt: new Date().toISOString() }
  users.push(user)
  return user
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = findUserByEmail(credentials.email as string)
        if (!user) return null
        // Simple password check (use bcrypt in production)
        if (user.password !== credentials.password) return null
        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) { (session.user as { id?: string }).id = token.id as string }
      return session
    },
  },
  trustHost: true,
})
