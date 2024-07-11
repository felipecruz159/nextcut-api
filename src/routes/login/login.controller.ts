import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

/**
 * Requisition that returns user information
 */
export default {
    async getByEmail(req: Request, res: Response) {
        const { email } = req.params;
        try {
            const user = await db.user.findUnique({
                where: { email: (email)},
            });
            return res.json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}