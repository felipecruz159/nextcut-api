import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const db = new PrismaClient();

export default {
   async configureBarbershop(req: Request, res: Response): Promise<Response> {
      const { barbershopId, startTime, endTime, intervalMinutes } = req.body;
      console.log(startTime, endTime, intervalMinutes);

      if (!barbershopId || !startTime || !endTime || !intervalMinutes) {
         return res.status(400).json({ message: "All fields are required." });
      }

      try {
         const interval = parseInt(intervalMinutes, 10);
         if (isNaN(interval)) {
            return res.status(400).json({ message: "Interval minutes must be a valid number." });
         }

         const startTimeISO = new Date(`1970-01-01T${startTime}:00`).toISOString();
         const endTimeISO = new Date(`1970-01-01T${endTime}:00`).toISOString();

         const configuration = await db.barbershopConfiguration.upsert({
            where: { barbershopId },
            update: { startTime: startTimeISO, endTime: endTimeISO, intervalMinutes: interval },
            create: { barbershopId, startTime: startTimeISO, endTime: endTimeISO, intervalMinutes: interval },
         });

         const availableSchedules = [];
         const intervalMs = interval * 60 * 1000;
         let current = new Date(startTimeISO);
         const end = new Date(endTimeISO);

         while (current < end) {
            availableSchedules.push({
               barbershopId,
               date: current.toISOString(),
               time: current.toISOString(),
               available: true,
            });

            current = new Date(current.getTime() + intervalMs);
         }

         await db.availableSchedules.createMany({
            data: availableSchedules,
            skipDuplicates: true,
         });

         return res.json({
            message: "Configuration saved and schedules generated successfully!",
            configuration,
         });
      } catch (error) {
         console.error("Error saving configuration and generating schedules:", error);
         return res.status(500).json({ message: "Internal server error." });
      }

   },
   async getAvailableSchedules(req: Request, res: Response): Promise<Response> {
      const { barbershopId } = req.params;
      console.log("Chewgeu")

      if (!barbershopId) {
         return res.status(400).json({ message: "BarbershopId é obrigatório." });
      }

      try {
         const schedules = await db.availableSchedules.findMany({
            where: { barbershopId },
            orderBy: { time: 'asc' },
         });

         if (schedules.length === 0) {
            return res.status(404).json({ message: "Não há horários disponíveis." });
         }

         return res.json(schedules);
      } catch (error) {
         console.error("Erro ao buscar horários:", error);
         return res.status(500).json({ message: "Erro interno do servidor." });
      }
   },
};
