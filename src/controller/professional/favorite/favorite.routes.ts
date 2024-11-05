import { Router } from 'express';
import favoriteController from './favorite.Controller';

const router = Router();

router.get('/favorites/:userId/:barbershopId', favoriteController.checkIfFavorited);

router.get('/favorites/:userId', favoriteController.getFavorites);

router.post('/favorites', favoriteController.saveFavorite);

export default router;
