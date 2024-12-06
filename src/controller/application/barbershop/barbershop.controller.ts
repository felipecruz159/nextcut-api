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
                    User: true,
                },
            });

            if (!barbershop) {
                return res.status(404).json({ error: "Barbearia não encontrada" });
            }

            if (barbershop.User) {
                const { password, ...userWithoutPassword }: any = barbershop.User;
                barbershop.User = userWithoutPassword;
            }

            res.status(200).json(barbershop);
        } catch (error) {
            console.error("Error fetching barbershop by ID:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async getBySearchQuery(req: Request, res: Response) {
        const { q: query } = req.params;

        try {
            const barbershops = await db.barbershop.findMany({
                where: {
                    name: {
                        contains: query,
                    },
                },
                include: {
                    address: true,
                    Rating: true,
                },
            });

            res.status(200).json(barbershops);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async countBarbershops(req: Request, res: Response) {
        try {
            const barbershops = await db.barbershop.count();

            res.status(200).json(barbershops);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};
