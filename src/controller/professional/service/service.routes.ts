import { Router } from 'express';
import serviceController from './service.controller';

const router = Router();

router.get('/services/user/:userId', serviceController.getServices);

export default router;
