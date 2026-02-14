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
                console.log("Authorize called", { email: credentials?.email });
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(1) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    try {
                        console.log("Attempting to find user:", email);
                        const user = await prisma.user.findUnique({ where: { email } });
                        console.log("User found:", !!user);

                        if (!user) return null;

                        const passwordsMatch = await verifyPassword(password, user.password);
                        console.log("Password match:", passwordsMatch);

                        if (passwordsMatch) return user;
                    } catch (error) {
                        console.error("Auth error in authorize:", error);
                        return null
                    }
                } else {
                    console.log("Invalid credentials format");
                }

                return null;
            },
        }),
    ],
});
