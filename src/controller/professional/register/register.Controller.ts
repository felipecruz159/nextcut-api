import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";

const db = new PrismaClient();

interface IRegisterBarbershopRequest extends Request {
   body: {
      name: string;
      phone: string;
      CEP: string;
      neighborhood: string;
      street: string;
      state: string;
      city: string;
      number: number;
      email: string
   }
}

interface IEmailCheck extends Request {
   body: {
      email: string;
   }
}

export default {
   async register(req: IRegisterBarbershopRequest, res: Response): Promise<Response> {
      const { name, phone, email, CEP, street, number, neighborhood, city, state } = req.body;
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
         const newBarbershop = await db.barbershop.create({
            data: {
               name,
               imageUrl: '',
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
      const { email } = req.query;

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
   }
};


