import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export default {
    async getBookings(req: Request, res: Response) {
        const { email } = req.query;

        try {
            const user = await db.user.findUnique({
                where: { email: email as string }
            });
            const bookings = await db.booking.findMany({
                where: { userId: user?.id },
                include: {
                    barbershop: {
                        select: {
                            name: true,
                        }
                    },
                    service: {
                        select: {
                            name: true,
                            price: true,
                        }
                    }
                }
            });


            return res.status(200).json({
                message: "Agendamentos encontrados com sucesso!",
                bookings,
            });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: "Bad Request" });
            return;
        }
    },

    async countBookings(req: Request, res: Response) {
        const { email } = req.query;

        const user = await db.user.findUnique({
            where: { email: email as string }
        });

        const totalBookings = await db.booking.count({
            where: { userId: user?.id },
        });

        return res.status(200).json({
            message: "Agendamentos contados com sucesso!",
            totalBookings,
        });
    },

    async getNextBookings(req: Request, res: Response) {
        const { email } = req.query;

        const user = await db.user.findUnique({
            where: { email: email as string }
        });

        const bookings = await db.booking.findMany({
            where: {
                userId: user?.id,
                AND: [
                    { date: { gt: new Date() } },
                    { status: 'Pendente' },
                ]
            },
            include: {
                service: {
                    select: {
                        name: true,
                        // price: true,
                    }
                },
                barbershop: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                date: 'asc',
            }
        });

        if (!bookings.length) return;

        return res.status(200).json({
            message: "Agendamentos encontrados com sucesso!",
            bookings,
        });

    }
}