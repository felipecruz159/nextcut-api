import { Router } from 'express';
import favoriteController from './favorite.Controller';

const router = Router();

router.post('/favorites', favoriteController.saveFavorite);

router.get('/favorites/:userId/:barbershopId', favoriteController.checkIfFavorited);

export default router;
