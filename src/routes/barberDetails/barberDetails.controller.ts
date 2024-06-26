import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export default {
   async getById(req: Request, res: Response) {
      const { id } = req.params;

      try {
         const barbershop = await db.barbershop.findUnique({
            where: { id: (id) },
         });

         if (!barbershop) {
            return res.status(404).json({ error: "Barbershop not found" });
         }

         return res.json(barbershop);
      } catch (error) {
         console.error("Error fetching barbershop:", error);
         res.status(500).json({ error: "Internal Server Error" });
      }
   }
};