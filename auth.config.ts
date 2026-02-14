import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role
            }
            return token
        }
    },
    providers: [],
    session: {
        strategy: "jwt"
    }
} satisfies NextAuthConfig
