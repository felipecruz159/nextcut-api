import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export default {
    async get(req: Request, res: Response) {
        try {
            const barbershops = await db.barbershop.findMany({
                include: {
                    address: true,
                    Rating: true,
                },
            });

            res.status(200).json(barbershops);
        } catch (error) {
            console.error("Error fetching barbershops:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async getById(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const barbershop = await db.barbershop.findUnique({
                where: { id },
                include: {
                    address: true,
                    Rating: true,
                },
            });

            if (!barbershop) {
                return res.status(404).json({ error: "Barbearia não encontrada" });
            }

            res.status(200).json(barbershop);
        } catch (error) {
            console.error("Error fetching barbershop by ID:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};
