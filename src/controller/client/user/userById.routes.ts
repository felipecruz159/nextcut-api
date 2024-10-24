import { Router } from 'express';
import userController from './user';

const router = Router();

router.get('/user', userController.userByEmail);

export default router;
