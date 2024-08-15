import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

const db = new PrismaClient();

export default {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user = await db.user.findUnique({
                where: { email: email },
            });

            if (!user || !user.password) {
                return res.status(401).json({ error: "Email ou senha inválido" });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: "Email ou senha inválido" });
            }

            return res.status(200).json({ user });
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    async googleAuth(req: Request, res: Response) {
        const { name, email, image, token, provider, access_token, expires_at, token_type, scope, session_state, refresh_token, providerAccountId, type } = req.body;

        try {
            let user = await db.user.findUnique({
                where: { email: email },
            });

            if (!user) {
                user = await db.user.create({
                    data: {
                        name,
                        email,
                        image,
                    },
                });
            }
            let account = await db.account.findUnique({
                where: {
                    providerAccountId_userId: {
                        providerAccountId: providerAccountId,
                        userId: user.id,
                    },
                },
            });

            if (!account) {
                account = await db.account.create({
                    data: {
                        provider,
                        access_token,
                        expires_at,
                        token_type,
                        type,
                        scope,
                        session_state,
                        refresh_token,
                        providerAccountId,
                        userId: user.id,
                    },
                });
            }
            return res.status(200).json({ token: token, user });
        } catch (error) {
            console.error("Error processing Google authentication:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}