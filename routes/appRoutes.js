import { Router } from "express";

import {
  searchPage,
  notFound,
  home,
  categories,
} from "../controller/appController.js";

const router = Router();

router.get("/", home);

router.get("/category/:id", categories);

router.get("/404", notFound);

router.post("/search", searchPage);

export default router;
