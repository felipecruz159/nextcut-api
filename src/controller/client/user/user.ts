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
         });

         if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
         }

         return res.status(200).json({ user });
      } catch (error) {
         console.error("Erro ao buscar usuário:", error);
         res.status(500).json({ error: "Erro interno no servidor" });
      }
   },
};
