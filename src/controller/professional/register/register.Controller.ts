import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import { IEmailCheck, ServiceFormData } from '../../../types/generic';

const db = new PrismaClient();

export default {
   async register(req: any, res: Response): Promise<Response> {
      const { name, phone, email, CEP, street, number, neighborhood, city, state } = req.body;
      const imageFile = req.file;

      try {
         const user = await db.user.findUnique({
            where: { email: email },
            include: { barbershop: true },
         });

         const parsedNumber = typeof number === 'string' ? parseInt(number, 10) : number;

         if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado. Por favor, cadastre-se.' });
         }

         if (user.barbershop.length > 0) {
            return res.status(400).json({ error: 'Usuário já possui uma barbearia registrada.' });
         }

         await db.user.update({
            where: { id: user.id },
            data: {
               type: "professional",
            },
         });

         const newAddress = await db.address.create({
            data: {
               zipCode: CEP,
               street: street,
               number: parsedNumber,
               neighborhood: neighborhood,
               city: city,
               state: state,
               userId: user.id,
            },
         });

         const imageName = imageFile ? imageFile.filename : '';
         const newBarbershop = await db.barbershop.create({
            data: {
               name,
               imageUrl: imageName,
               phone,
               userId: user.id,
               addressId: newAddress.id,
            },
         });

         return res.status(201).json(newBarbershop);
      } catch (error) {
         console.error('Erro ao criar barbearia:', error);
         return res.status(500).json({ error: 'Erro ao criar barbearia.' });
      }
   },

   async emailCheck(req: IEmailCheck, res: Response): Promise<Response> {
      const { email } = req.body;

      if (!email || typeof email !== 'string') {
         return res.status(400).json({ available: false, error: "Email não fornecido." });
      }

      const user = await db.user.findUnique({
         where: { email: email }
      });

      if (!user) {
         return res.status(404).json({ available: false, error: "Usuário não encontrado." });
      }

      if (!user.emailVerified) {
         return res.status(400).json({ available: false, error: "Email não verificado." });
      }

      return res.status(200).json({ available: true });
   },
   async registerService(req: Request, res: Response): Promise<Response> {
      const { name, description, price, category, time, barbershopId } = req.body as ServiceFormData;

      try {
         if (!barbershopId) {
            return res.status(400).json({ error: 'ID da barbearia é obrigatório para associar o serviço.' });
         }

         const newService = await db.service.create({
            data: {
               name,
               description,
               price,
               category,
               time,
               barbershopId,
            },
         });

         return res.status(201).json(newService);
      } catch (error) {
         console.error('Erro ao registrar serviço:', error);
         return res.status(500).json({ error: 'Erro ao registrar o serviço.' });
      }
   },
};
