import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/prisma';
import { verifyPassword } from './lib/password';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(1) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await prisma.user.findUnique({ where: { email } });

                    if (!user) return null;

                    const passwordsMatch = await verifyPassword(password, user.password);
                    if (passwordsMatch) return user;
                }

                return null;
            },
        }),
    ],
});
