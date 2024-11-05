import { Router } from 'express';
import registerController from './register.controller';

const router = Router();

router.post('/register', registerController.register)

export default router;