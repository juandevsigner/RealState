import { Router } from "express";
import {
  formLogin,
  formRegister,
  resetPassword,
  register,
  confirm,
  resetPasswordEndPoint,
  checkToken,
  newPassword,
  validateUser,
  logout,
} from "../controller/userController.js";

const router = Router();

router.get("/login", formLogin);
router.post("/login", validateUser);

router.post("/logout", logout);

router.get("/register", formRegister);
router.post("/register", register);

router.get("/confirm/:token", confirm);

router.get("/reset-password", resetPassword);
router.post("/reset-password", resetPasswordEndPoint);

router.get("/reset-password/:token", checkToken);
router.post("/reset-password/:token", newPassword);

export default router;
