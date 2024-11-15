// routes/informationRoutes.ts
import { Router } from 'express';
import informationController from './information.controller';
import multer from 'multer';
import multerConfig from '../../../config/multer';

const router = Router();
const upload = multer(multerConfig);

router.put('/information/edit/:barbershopId', informationController.updateInformation);

router.put('/informationWithImage/edit/:barbershopId', upload.single('barberShopBackground'), informationController.updateInformationWithImage);

router.get('/information/client/:barbershopId', informationController.InformationClient);

export default router;
