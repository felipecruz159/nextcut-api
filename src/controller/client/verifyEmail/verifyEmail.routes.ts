import { Router } from 'express';
import verifyEmailController from './verifyEmail.controller';

const router = Router();

router.post('/verifyemail', verifyEmailController.verifyEmail)
router.post('/verify-logged-email', verifyEmailController.verifyLoggedEmail)

export default router;