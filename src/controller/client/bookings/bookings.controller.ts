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


    //Maybe this requisition should be limited by day in the future
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

        let myBarbershopBookings: any = [];

        if (user?.type === 'professional') {
            const barbershop = await db.barbershop.findUnique({
                where: {
                    userId: user?.id,
                }
            })

            if (barbershop) {
                myBarbershopBookings = await db.booking.findMany({
                    where: {
                        barbershopId: barbershop.id,
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
            }

            // console.log('myBarbershopBookings', myBarbershopBookings);
        }

        let combinedBookings = [
            ...new Map(bookings.concat(myBarbershopBookings).map((booking) => [booking.id, booking])).values()
        ];

        combinedBookings = combinedBookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (!bookings.length && !myBarbershopBookings.length) {
            return res.status(200).json({
                message: 'Nenhum agendamento encontrado',
                combinedBookings: [],
            })
        };

        // console.log('combinedBookings', combinedBookings)

        return res.status(200).json({
            message: "Agendamentos encontrados com sucesso!",
            combinedBookings: combinedBookings,
        });

    }
}