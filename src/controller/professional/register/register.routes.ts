import { Router } from 'express';
import registerController from './register.Controller';
import emailCheckController from './register.Controller'

const router = Router();

router.post('/register-professional', registerController.register)

router.get('/check-email', emailCheckController.emailCheck)

export default router;