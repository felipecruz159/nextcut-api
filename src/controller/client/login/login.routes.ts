import { Router } from 'express';
import loginController from './login.controller';

const router = Router();

router.post('/auth/login', loginController.login)

export default router;