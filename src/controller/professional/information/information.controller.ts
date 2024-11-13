import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const db = new PrismaClient();

export default {
   async updateInformation(req: Request, res: Response): Promise<Response> {
      const { barbershopId } = req.params;
      const payload = req.body;
      console.log(payload.operation)
      if (!barbershopId) {
         return res.status(400).json({ message: "barbershopId é obrigatório." });
      }

      try {
         const barbershop = await db.barbershop.findUnique({
            where: { id: barbershopId },
         });

         if (!barbershop) {
            return res.status(404).json({ message: "Barbearia não encontrada." });
         }

         const updatedBarbershop = await db.barbershop.update({
            where: { id: barbershopId },
            data: {
               about: payload.about,
               phone: payload.phone,
               operation: payload.operation,
            },
         });

         if (payload.address) {
            await db.address.updateMany({
               where: { barbershopId: barbershopId },
               data: {
                  zipCode: payload.address.zipCode,
                  neighborhood: payload.address.neighborhood,
                  street: payload.address.street,
                  number: payload.address.number,
                  state: payload.address.state,
                  city: payload.address.city,
               },
            });
         }

         return res.status(200).json({ message: "Informações atualizadas com sucesso", data: updatedBarbershop });
      } catch (error) {
         console.error("Erro ao atualizar informações:", error);
         return res.status(500).json({ message: "Erro interno do servidor." });
      }
   },
};
