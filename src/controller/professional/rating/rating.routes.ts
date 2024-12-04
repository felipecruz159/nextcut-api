import { Router } from 'express';
import ratingController from './rating.controller';

const router = Router();

router.post('/ratings', ratingController.saveRating);
router.get('/get-rating/:id', ratingController.getRating);

export default router;
