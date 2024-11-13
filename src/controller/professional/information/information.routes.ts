// routes/informationRoutes.ts
import { Router } from 'express';
import informationController from './information.controller';

const router = Router();

router.put('/information/edit/:barbershopId', informationController.updateInformation);

export default router;
