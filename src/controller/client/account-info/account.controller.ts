import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export default {
    async updateUserAccount(req: Request, res: Response) {
        const { email, name, phone } = req.body;

        try {
            await db.user.update({
                where: { email: email },
                data: { name: name, phone: phone }
            });

            return res.status(200).json({ message: "Dados atualizados com sucesso!" });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: "Bad Request" });
            return;
        }

    }
}