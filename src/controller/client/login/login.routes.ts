import { Router } from 'express';
import loginController from './login.controller';

const router = Router();

router.post('/auth/login', loginController.login)
router.post('/auth/google', loginController.googleAuth)

export default router;