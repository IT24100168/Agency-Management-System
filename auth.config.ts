import type { NextAuthConfig } from 'next-auth';

export const authConfig: any = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }: { session: any, token: any }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }: { token: any, user: any }) {
            if (user) {
                token.role = (user as any).role
            }
            return token
        }
    },
    providers: [],
    session: {
        strategy: "jwt"
    },
    authorized({ auth, request: { nextUrl } }: any) {
        const isLoggedIn = !!auth?.user;
        const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

        if (isOnDashboard) {
            if (isLoggedIn) return true;
            return false; // Redirect unauthenticated users to login page
        } else if (isLoggedIn) {
            // Optional: Redirect logged-in users away from login page?
            // For now, let's just allow them to access dashboard if they try to visit login
            return true;
        }
        return true;
    },
}
