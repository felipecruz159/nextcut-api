import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const db = new PrismaClient();

export default {
   // Obter serviços
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

   async getServicesClient(req: Request, res: Response): Promise<Response> {
      const { barberShopId } = req.params;

      if (!barberShopId) {
         return res.status(400).json({ message: "barberShopId é obrigatório." });
      }

      try {
         const barbershop = await db.barbershop.findFirst({
            where: { id: barberShopId },
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

   async updateService(req: Request, res: Response): Promise<Response> {
      const { serviceId } = req.params;
      const { name, description, category, price, time } = req.body;

      if (!serviceId) {
         return res.status(400).json({ message: "serviceId é obrigatório." });
      }

      try {
         const updatedService = await db.service.update({
            where: { id: serviceId },
            data: {
               name,
               description,
               category,
               price,
               time,
            },
         });

         return res.json(updatedService);
      } catch (error) {
         console.error("Erro ao atualizar o serviço:", error);
         return res.status(500).json({ message: "Erro interno do servidor." });
      }
   },

   async deleteService(req: Request, res: Response): Promise<Response> {
      const { serviceId } = req.params;

      if (!serviceId) {
         return res.status(400).json({ message: "serviceId é obrigatório." });
      }

      try {
         const deletedService = await db.service.delete({
            where: { id: serviceId },
         });

         return res.json({ message: "Serviço excluído com sucesso!", service: deletedService });
      } catch (error) {
         console.error("Erro ao excluir o serviço:", error);
         return res.status(500).json({ message: "Erro interno do servidor." });
      }
   },
};
