import { Router } from "express";
import {
  formLogin,
  formRegister,
  resetPassword,
  register,
  confirm,
} from "../controller/userController.js";

const router = Router();

router.get("/login", formLogin);
router.get("/register", formRegister);
router.post("/register", register);
router.get("/confirm/:token", confirm);

router.get("/reset-password", resetPassword);

export default router;
