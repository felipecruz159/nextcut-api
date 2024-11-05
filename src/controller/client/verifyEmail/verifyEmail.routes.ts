import { Router } from 'express';
import verifyEmailController from './verifyEmail.controller';

const router = Router();

router.post('/verifyemail', verifyEmailController.verifyEmail)

export default router;