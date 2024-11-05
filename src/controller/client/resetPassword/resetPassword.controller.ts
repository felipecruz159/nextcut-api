import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import { sendEmail } from '../../../utils/sendEmail';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

export default {

    async resetPasswordEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.body;

            const user = await db.user.findUnique({
                where: {
                    email: email,
                },
            })

            if(!user) {
                return res.status(400).json({error: "Nenhum usuário cadastrado com este email!" });
            }

            await sendEmail({email, emailType: 'reset', userId: user.id})

            return res.status(200).json({success: 'Email enviado com sucesso'});
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });    
        }
    },

    async resetPassword(req: Request, res: Response): Promise<Response> {
        try {
            const { token, newPassword } = req.body;

            const user = await db.verificationToken.findUnique({
                where: {
                    token: token,
                    AND: { expires: { gt: new Date() } }
                },
                include: {
                    user: true
                }
            })

            if(!user) {
                return res.status(400).json({error: "Token expirou!" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await db.user.update({
                where: { id: user.userId },
                data: {
                    password: hashedPassword,
                }
            })
            
            await db.verificationToken.delete({
                where: {
                    userId: user.userId
                }
            })

            return res.status(200).json({success: 'Sucesso ao redefinir a senha'});
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ error: "Internal Server Error" });    
        }
    }
}



