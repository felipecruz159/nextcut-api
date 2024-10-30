import { Router } from 'express';
import updateAccountController from './account-controller';

const router = Router();

router.post('/update-account-info', updateAccountController.updateUserAccount)

export default router;