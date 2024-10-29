import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const db = new PrismaClient();

export default {
   async saveFavorite(req: Request, res: Response): Promise<Response> {
      const { userId, barbershopId } = req.body;

      if (!userId || !barbershopId) {
         return res.status(400).json({ message: "userId e barbershopId são obrigatórios." });
      }

      try {
         const existingFavorite = await db.favorite.findUnique({
            where: {
               userId_barbershopId: {
                  userId,
                  barbershopId,
               },
            },
         });

         if (existingFavorite) {
            await db.favorite.delete({
               where: {
                  id: existingFavorite.id,
               },
            });
            return res.json({ favorited: false, message: "Favorito removido com sucesso." });
         } else {
            await db.favorite.create({
               data: {
                  userId,
                  barbershopId,
               },
            });
            return res.json({ favorited: true, message: "Favorito salvo com sucesso." });
         }
      } catch (error) {
         console.error("Erro ao salvar o favorito:", error);
         return res.status(500).json({ message: "Erro interno do servidor." });
      }
   },

   async checkIfFavorited(req: Request, res: Response): Promise<Response> {
      const { userId, barbershopId } = req.params;

      if (!userId || !barbershopId) {
         return res.status(400).json({ message: "userId e barbershopId são obrigatórios." });
      }

      try {
         const existingFavorite = await db.favorite.findUnique({
            where: {
               userId_barbershopId: {
                  userId,
                  barbershopId,
               },
            },
         });

         return res.json({ favorited: !!existingFavorite });
      } catch (error) {
         console.error("Erro ao verificar se o favorito existe:", error);
         return res.status(500).json({ message: "Erro interno do servidor." });
      }
   },
};
