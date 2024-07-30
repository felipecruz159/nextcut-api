import { Router } from 'express';
import barbershopController from './barbershop.controller';

const router = Router();

router.get('/barbershop', barbershopController.get)

export default router;