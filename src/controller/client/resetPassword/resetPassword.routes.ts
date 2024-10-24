import { Router } from 'express';
import resetPasswordController from './resetPasswordController'

const router = Router();

router.post('/reset-password-email', resetPasswordController.resetPasswordEmail)
router.post('/reset-password', resetPasswordController.resetPassword)

export default router;