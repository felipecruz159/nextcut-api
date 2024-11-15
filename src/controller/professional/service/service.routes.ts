import { Router } from 'express';
import serviceController from './service.controller';

const router = Router();

router.get('/services/user/:userId', serviceController.getServices);
router.get('/services/client/:barberShopId', serviceController.getServicesClient);
router.put('/updateService/:serviceId', serviceController.updateService)
router.delete('/service/delete/:serviceId', serviceController.deleteService)

export default router;
