import { Router } from 'express';
import userController from './user.controller';

const router = Router();

router.get('/user', userController.userByEmail);

export default router;
