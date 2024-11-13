import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import { sendEmail } from '../../../utils/sendEmail';

const db = new PrismaClient();

export default {

    async verifyEmail(req: Request, res: Response): Promise<Response> {
        try {
            const reqBody = await req.body;
            const { token } = reqBody;

            const user = await db.verificationToken.findUnique({
                where: {
                    token: token,
                    AND: { expires: { gt: new Date() } }
                },
                include: {
                    user: true
                }
            })

            if (!user) {
                return res.status(400).json({ error: "Token inválido!" });
            }

            await db.user.update({
                where: { id: user.userId },
                data: {
                    emailVerified: new Date(),
                }
            })

            await db.verificationToken.delete({
                where: {
                    userId: user.userId
                }
            })

            return res.status(200).json({ success: 'Sucesso ao verificar o email' });
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    async verifyLoggedEmail(req: Request, res: Response) {
        const { email, userId } = req.body;
        try {
            await sendEmail({ email, emailType: 'verify', userId: userId })
        } catch (err) {
            return res.status(404).json({ message: 'Não foi possível enviar o email' });
        }

        return res.status(200).json({ message: 'O email foi enviado com sucesso' });
    }
}



