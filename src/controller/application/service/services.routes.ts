// src/routes/serviceRoutes.ts
import { Router } from 'express';
import serviceController from './service.controller';

const router = Router();

router.get('/service', serviceController.get)

export default router;