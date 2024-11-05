import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import EmailVerificationProps from '../types/EmailVerificationProps';
import htmlVerifyEmailTemplate from './htmlVerifyEmailTemplate';
import htmlResetPasswordTemplate from './htmlResetPasswordTemplate';

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
        else if (emailType === 'reset') {
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

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const urlDomain = 'http://localhost:3000/';
        const urlVerifyEmail = urlDomain + 'verifyemail?token=' + hashedToken;
        const urlResetPassword = urlDomain + 'reset-password?token=' + hashedToken;

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: emailType === 'verify' ? "Verifique o seu email" : "Recuperação de senha",
            html: emailType === 'verify' ? htmlVerifyEmailTemplate(urlVerifyEmail) : htmlResetPasswordTemplate(urlResetPassword)
        }

        const mailResponse = await transport.sendMail(mailOptions);

        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
}