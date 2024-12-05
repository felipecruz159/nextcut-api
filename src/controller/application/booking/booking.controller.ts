import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export default {
   async create(req: Request, res: Response) {
      const {
         barberShopId,
         serviceId,
         userId,
         time,
         date,
         paymentMethod,
         isSpecial,
         serviceLocation,
         status,
      } = req.body;

      if (
         !barberShopId ||
         !serviceId ||
         !userId ||
         !time ||
         !date ||
         !paymentMethod ||
         serviceLocation === undefined ||
         status === undefined
      ) {
         return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
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
         console.error('Error creating booking:', error);
         res.status(500).json({ error: 'Erro interno do servidor' });
      }
   },

   async delete(req: Request, res: Response) {
      const { bookingId } = req.params;

      if (!bookingId) {
         return res.status(400).json({ error: 'O ID do agendamento é obrigatório' });
      }

      try {
         const deletedBooking = await db.booking.delete({
            where: { id: bookingId },
         });

         res.status(200).json(deletedBooking);
      } catch (error) {
         console.error('Error deleting booking:', error);
         if ((error as any).code === 'P2025') {
            // Erro Prisma: Nenhum registro encontrado
            res.status(404).json({ error: 'Agendamento não encontrado' });
         } else {
            res.status(500).json({ error: 'Erro interno do servidor' });
         }
      }
   },
};
