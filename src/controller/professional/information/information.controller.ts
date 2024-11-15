import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import path from 'path';
import fs from "fs";

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

   async updateInformationWithImage(req: Request, res: Response): Promise<Response> {
      const { barbershopId } = req.params;
      const imageFile = req.file;
      const { name, specialService, homeService } = req.body;

      if (!barbershopId) {
         return res.status(400).json({ message: "O ID da barbearia é obrigatório." });
      }

      try {
         const barbershop = await db.barbershop.findUnique({
            where: { id: barbershopId },
         });

         if (!barbershop) {
            return res.status(404).json({ message: "Barbearia não encontrada." });
         }

         const imageFolderPath = path.join(__dirname, "..", "..", "..", "public", "barberShop");

         if (barbershop.imageUrl && imageFile) {
            const oldImagePath = path.join(imageFolderPath, barbershop.imageUrl);
            if (fs.existsSync(oldImagePath)) {
               fs.unlinkSync(oldImagePath);
               console.log(`Imagem antiga removida: ${oldImagePath}`);
            }
         }

         const updateData: any = {
            name,
            specialService: specialService === 'true',
            homeService: homeService === 'true',
         };

         if (imageFile) {
            updateData.imageUrl = imageFile.filename;
         }

         const updatedBarbershop = await db.barbershop.update({
            where: { id: barbershopId },
            data: updateData,
         });

         return res.status(200).json({
            message: "Informações atualizadas com sucesso.",
            data: updatedBarbershop,
         });
      } catch (error) {
         console.error("Erro ao atualizar informações:", error);
         return res.status(500).json({ message: "Erro interno do servidor." });
      }
   },

   async InformationClient(req: Request, res: Response): Promise<Response> {
      const { barbershopId } = req.params; console.log(barbershopId)

      if (!barbershopId) {
         return res.status(400).json({ message: "barbershopId é obrigatório." });
      }

      try {
         const barbershop = await db.barbershop.findUnique({
            where: { id: barbershopId },
            select: {
               about: true,
               phone: true,
               operation: true,
               address: true
            },
         });

         if (!barbershop) {
            return res.status(404).json({ message: "Barbearia não encontrada." });
         }

         return res.status(200).json({ data: barbershop });
      } catch (error) {
         console.error("Erro ao buscar informações:", error);
         return res.status(500).json({ message: "Erro interno do servidor." });
      }
   }

};
