import { Router } from 'express';
import barbershopController from './barbershop.controller';

const router = Router();

router.get('/barbershop', barbershopController.get)
router.get('/barbershop/:id', barbershopController.getById)
router.get('/search/:q', barbershopController.getBySearchQuery)
router.get('/count-barbershops', barbershopController.countBarbershops)

export default router;