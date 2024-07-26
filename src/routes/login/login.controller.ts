import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";

const db = new PrismaClient();

/**
 * Requisition that returns user information
 */
export default {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        try {
            const user = await db.user.findUnique({
                where: { email: (email)},
            });

            console.log(user);
            if(!user || !user.password) {
                return res.status(401).json({ error: "Email ou senha inválido" });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if(!isValidPassword) {
                return res.status(401).json({ error: "Email ou senha inválido" });
            }

            return res.status(200).json({ user });
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}