import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';

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
         const hashedPassword = await bcrypt.hash(password, 10);

         const user = await db.user.create({
            data: {
               name,
               email,
               password: hashedPassword,
            },
         });
         return res.status(201).json(user);
      } catch (error) {
         console.error('Error Creating User:', error);
         return res.status(400).json({ error: 'Erro ao criar usuário.' });
      }
   }
}



