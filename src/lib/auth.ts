import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

/**
 * Auth.js configuration.
 * MVP: email/password credentials for administrators.
 * Future: add Google OAuth provider without refactoring session handling.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (_credentials) => {
        // Implemented in Phase 8 — validates against AdminUser in database
        return null;
      },
    }),
    // Future: Google({ clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = 'ADMIN';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
