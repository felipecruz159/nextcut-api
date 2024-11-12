import { Router } from 'express';
import bookingsController from './bookings.controller';

const router = Router();

router.get('/get-bookings', bookingsController.getBookings)
router.get('/count-bookings', bookingsController.countBookings)
router.get('/get-next-bookings', bookingsController.getNextBookings)

export default router;