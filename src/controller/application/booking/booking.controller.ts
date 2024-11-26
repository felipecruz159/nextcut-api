import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export default {
   async create(req: Request, res: Response) {
      const { barberShopId, serviceId, userId, time, date, paymentMethod, isSpecial, serviceLocation, status } = req.body;

      if (!barberShopId || !serviceId || !userId || !time || !date || !paymentMethod || serviceLocation === undefined || status === undefined) {
         return res.status(400).json({ error: "Todos os campos são obrigatórios" });
      }

      try {
         const booking = await db.booking.create({
            data: {
               barbershopId: barberShopId,
               serviceId,
               userId,
               time,
               date: new Date(date),
               paymentMethod,
               isSpecial,
               serviceLocation,
               status,
            },
         });

         res.status(201).json(booking);
      } catch (error) {
         console.error("Error creating booking:", error);
         res.status(500).json({ error: "Erro interno do servidor" });
      }
   },
}
