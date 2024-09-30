import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import EmailVerificationProps from '../types/EmailVerificationProps';

const db = new PrismaClient();

export const sendEmail = async ({ email, emailType, userId }: EmailVerificationProps) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        //* Verify email function
        if (emailType === 'verify') {
            await db.verificationToken.upsert({
                where: { userId: userId },
                update: {
                    token: hashedToken,
                    expires: new Date(Date.now() + 3600000), // 1 hour
                },
                create: {
                    userId: userId,
                    token: hashedToken,
                    expires: new Date(Date.now() + 3600000), // 1 hour
                }
            })
        }
        //TODO: Reset password function
        else if (emailType === 'reset') {
            await db.verificationToken.upsert({
                where: { userId: userId },
                update: {
                    token: hashedToken,
                    expires: new Date(Date.now() + 300000), // 5 minutes
                },
                create: {
                    userId: userId,
                    token: hashedToken,
                    expires: new Date(Date.now() + 300000), // 5 minutes
                }
            })
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
                //   TODO: Change this and add to .env file
            }
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: emailType === 'verify' ? "Verifique o seu email" : "Recuperação de senha",
            html: emailType === 'verify' ? `<p>Teste Verifique</p><a href="http://localhost:3000/verifyemail?token=${hashedToken}">Clique aqui</a>` : `<p>Teste Recupere</p><a href="http://localhost:3000/verifyemail?token=${hashedToken}">Clique aqui</a>`
            // TODO: Make an email layout 
        }

        const mailresponse = await transport.sendMail(mailOptions);

        return mailresponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
}