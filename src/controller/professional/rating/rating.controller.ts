import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const db = new PrismaClient();

export default {
   async saveRating(req: Request, res: Response): Promise<Response> {
      const { comment, rating, bookingId } = req.body;

      if (!bookingId || !rating) {
         return res.status(400).json({ message: "Dados insuficientes." });
      }

      try {
         const booking = await db.booking.findUnique({
            where: { id: bookingId },
            select: {
               userId: true,
               barbershopId: true,
            },
         });
         
         if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
         }

         await db.rating.create({
            data: {
               userId: booking.userId,
               barbershopId: booking.barbershopId,
               bookingId,
               comment,
               rating,
            },
         });

         const barbershop = await db.barbershop.findUnique({
            where: { id: booking?.barbershopId },
            select: {
               id: true,
               totalStars: true,
               appraiser: true,
            },
         });

         if (!barbershop) {
            throw new Error("Barbershop não encontrado.");
         }

         const updatedBarbershop = await db.barbershop.update({
            where: { id: barbershop.id },
            data: {
               appraiser: {
                  increment: 1,
               },
               totalStars: {
                  increment: rating,
               },
            },
            select: {
               totalStars: true,
               appraiser: true,
            },
         });

         const totalStars = updatedBarbershop.totalStars ?? 0;
         const appraiser = updatedBarbershop.appraiser ?? 0;

         const newRating = totalStars / appraiser;

         await db.barbershop.update({
            where: { id: barbershop.id },
            data: {
               rating: newRating,
            },
         });

         return res.status(201).json({ message: "Avaliação salva com sucesso." });

      } catch (error) {
         console.error("Erro ao avaliar:", error);
         return res.status(500).json({ message: "Erro interno do servidor." });
      }
   },

   async getRating(req: Request, res: Response) {
      const { id } = req.params;
      try {
         const rating = await db.rating.findUnique({
            where: { id: id }
         });

         return res.status(200).json(rating);
      } catch (err) {
         console.error(err);
         res.status(400).json({ error: "Bad Request" });
         return;
      }
   },
};
