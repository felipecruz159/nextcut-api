import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

/**
 * Requisition that returns all the barbershops
 */
export default {
    async get(req: Request, res: Response) {
        try {
            const barbershops = await db.barbershop.findMany();
            return res.json(barbershops);
        } catch (error) {
            console.error("Error fetching barbershops:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}