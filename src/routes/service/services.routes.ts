// src/routes/serviceRoutes.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const db = new PrismaClient();

router.get('/service', async (req: Request, res: Response) => {
    try {
        const services = await db.barbershop.findMany();
        return res.json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;