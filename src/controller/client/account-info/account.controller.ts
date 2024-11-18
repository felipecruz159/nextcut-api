import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export default {
    async updateUserAccount(req: Request, res: Response) {
        const { email, name, phone, addressData } = req.body;

        try {
            const user = await db.user.update({
                where: { email: email },
                data: { name: name, phone: phone }
            });

            await db.address.upsert({
                where: { userId: user?.id },
                update: {
                    zipCode: addressData.zipCode,
                    state: addressData.state,
                    city: addressData.city,
                    neighborhood: addressData.neighborhood,
                    street: addressData.street,
                    number: Number(addressData.number),
                },
                create: {
                    userId: user?.id,
                    zipCode: addressData.zipCode,
                    state: addressData.state,
                    city: addressData.city,
                    neighborhood: addressData.neighborhood,
                    street: addressData.street,
                    number: Number(addressData.number),
                },
            })

            return res.status(200).json({ message: "Dados atualizados com sucesso!" });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: "Bad Request" });
            return;
        }

    }
}