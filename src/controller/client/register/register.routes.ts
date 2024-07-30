import { Router } from 'express';
import registerController from './registerController';

const router = Router();

router.post('/register', registerController.register)

export default router;