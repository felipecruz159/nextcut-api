import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const db = new PrismaClient();

/**
 * Requisition that returns all the barbershops
 */
router.get('/barbershops', async(req: Request, res: Response) => {
    try {
        const barbershops = await db.barbershop.findMany();
        return res.json(barbershops);
    } catch (error) {
        console.error("Error fetching barbershops:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;