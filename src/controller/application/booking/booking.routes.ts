import { Router } from 'express';
import bookingController from './booking.controller';

const router = Router();

router.post('/bookings', bookingController.create)

export default router;