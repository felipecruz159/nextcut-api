import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

/**
 * Requisition that returns all the services
 */
export default {
    async get(req: Request, res: Response){
        try {
            const services = await db.service.findMany();
            return res.json(services);
        } catch (error) {
            console.error("Error fetching services:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

