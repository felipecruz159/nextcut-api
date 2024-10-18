import { Router } from 'express';
import verifyEmailController from './verifyEmailController';

const router = Router();

router.post('/verifyemail', verifyEmailController.verifyEmail)

export default router;