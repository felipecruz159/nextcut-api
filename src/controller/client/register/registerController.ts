import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { sendEmail } from '../../../utils/sendEmail'

const db = new PrismaClient();

interface IregisterUserRequest extends Request {
   body: {
      name: string;
      email: string;
      password: string;
   }
}

export default {

   async register(req: IregisterUserRequest, res: Response): Promise<Response> {
      const { name, email, password } = req.body;

      try {
         const emailExists = await db.user.findUnique({
            where: { email: (email) },
         });

         if (emailExists) {
            return res.status(409).json({ error: 'Email já cadastrado!' })
         }

         const hashedPassword = await bcrypt.hash(password, 10);

         const user = await db.user.create({
            data: {
               name,
               email,
               password: hashedPassword,
               type: "client"
            },
         });

         //Send verification email
         await sendEmail({email, emailType: 'verify', userId: user.id})

         return res.status(201).json(user);
      } catch (error) {
         console.error('Error Creating User:', error);
         return res.status(400).json({ error: 'Erro ao criar usuário.' });
      }
   }
}



