
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/prisma';
import { verifyPassword } from './lib/password';

export const { auth, signIn, signOut, handlers } = NextAuth({
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await prisma.user.findUnique({ where: { email } });
                    if (!user) return null;

                    const passwordsMatch = await verifyPassword(password, user.password);
                    if (passwordsMatch) return user;
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                // Fetch role from DB or use token if strategy is JWT
                // We'll stick to a simple strategy for now: relying on what we put in the token
                session.user.id = token.sub;

                // We need to fetch the user to get the role if we want it up to date, 
                // or we can persist it in the token. For simplicity, let's fetch.
                // Actually, better to put it in the token.
            }
            return session;
        },
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.role = (user as any).role
            }
            return token
        }
    },
    session: {
        strategy: "jwt"
    }
});
