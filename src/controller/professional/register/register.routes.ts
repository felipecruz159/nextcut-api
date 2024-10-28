import { Router } from 'express';
import multerConfig from '../../../config/multer'; // ajuste o caminho conforme necessário
import registerController from './register.Controller';
import emailCheckController from './register.Controller';
import registerServiceController from './register.Controller';
import multer from 'multer';

const router = Router();
const upload = multer(multerConfig);

router.post('/register-professional', upload.single('barberShopBackground'), registerController.register);
router.get('/check-email', emailCheckController.emailCheck);
router.post('/registerService', registerServiceController.registerService);

export default router;
