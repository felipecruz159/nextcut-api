import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const db = new PrismaClient();

export default {
   async getServices(req: Request, res: Response): Promise<Response> {
      const { userId } = req.params;

      if (!userId) {
         return res.status(400).json({ message: "userId é obrigatório." });
      }

      try {
         const barbershop = await db.barbershop.findFirst({
            where: { userId: userId },
         });

         if (!barbershop) {
            return res.status(404).json({ message: "Nenhuma barbearia encontrada para este usuário." });
         }

         const services = await db.service.findMany({
            where: { barbershopId: barbershop.id },
            select: {
               id: true,
               name: true,
               description: true,
               category: true,
               price: true,
               time: true,
            },
         });

         if (services.length === 0) {
            return res.status(404).json({ message: "Nenhum serviço encontrado para esta barbearia." });
         }

         return res.json(services);
      } catch (error) {
         console.error("Erro ao buscar serviços:", error);
         return res.status(500).json({ message: "Erro interno do servidor." });
      }
   },
};