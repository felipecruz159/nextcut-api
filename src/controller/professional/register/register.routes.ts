import { Router } from 'express';
import multerConfig from '../../../config/multer'; // ajuste o caminho conforme necessário
import registerController from './register.controller';
import emailCheckController from './register.controller';
import registerServiceController from './register.controller';
import multer from 'multer';

const router = Router();
const upload = multer(multerConfig);

router.post('/register-professional', upload.single('barberShopBackground'), registerController.register);
router.get('/check-email', emailCheckController.emailCheck);
router.post('/registerService', registerServiceController.registerService);

export default router;
