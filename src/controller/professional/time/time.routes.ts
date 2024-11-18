import express from 'express';
import controller from './time.controller';

const router = express.Router();

router.post('/settingTimeService', controller.configureBarbershop);
router.get('/schedules/:barbershopId', controller.getAvailableSchedules);

export default router;
