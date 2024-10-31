import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export default {
   async userByEmail(req: Request, res: Response) {
      const { email } = req.query;

      if (!email) {
         return res.status(400).json({ error: "Email é obrigatório" });
      }

      try {
         const user = await db.user.findUnique({
            where: { email: String(email) },
            include: {
               barbershop: true,
               address: true,
               ratings: true
            },
         });

         if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
         }

         const userWithDetails = {
            ...user,
            barbershop: user.barbershop.length > 0 ? user.barbershop[0] : null,
            address: user.address.length > 0 ? user.address[0] : null,
            ratings: user.ratings.length > 0 ? user.ratings[0] : null
         };

         return res.status(200).json({ user: userWithDetails });
      } catch (error) {
         console.error("Erro ao buscar usuário:", error);
         res.status(500).json({ error: "Erro interno no servidor" });
      }
   },
};
