import { Router } from 'express';
import bookingsController from './bookings.controller';

const router = Router();

router.get('/get-bookings', bookingsController.getBookings)
router.get('/count-bookings', bookingsController.countBookings)

export default router;