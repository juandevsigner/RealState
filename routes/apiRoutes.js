import { Router } from "express";
import { properties } from "../controller/apiController.js";

const router = Router();

router.get("/properties", properties);

export default router;
