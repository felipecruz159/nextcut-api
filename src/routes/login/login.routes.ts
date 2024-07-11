import { Router } from 'express';
import loginController from './login.controller';

const router = Router();

router.get('/login/:email', loginController.getByEmail)

export default router;