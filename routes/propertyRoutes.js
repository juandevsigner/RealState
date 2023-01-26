import { Router } from "express";
import { body } from "express-validator";
import { admin, create, save } from "../controller/propertyController.js";

const router = Router();

router.get("/my-propertys", admin);
router.get("/my-propertys/create", create);
router.post(
  "/my-propertys/create",
  body("title").notEmpty().withMessage("Title is required"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 200 })
    .withMessage("Description is so long"),
  body("category").isNumeric().withMessage("Choose a category"),
  body("price").isNumeric().withMessage("Choose a range price"),
  body("rooms").isNumeric().withMessage("Choose a quantity of rooms"),
  body("parking").isNumeric().withMessage("Choose a quantity of parking areas"),
  body("wc").isNumeric().withMessage("Choose a quantity of wc"),
  body("lat").notEmpty().withMessage("Put property on map"),
  save
);

export default router;
