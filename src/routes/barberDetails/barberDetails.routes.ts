import { Router } from "express";
import barberDetailsController from "./barberDetails.controller";


const router = Router();

router.get('/barberdetails/:id', barberDetailsController.getById)

export default router;