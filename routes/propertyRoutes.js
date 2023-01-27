import { Router } from "express";
import { body } from "express-validator";
import {
  admin,
  create,
  save,
  addImage,
  saveImage,
} from "../controller/propertyController.js";
import routeLock from "../middleware/routeLock.js";
import upload from "../middleware/uploadImage.js";

const router = Router();

router.get("/propertys", routeLock, admin);
router.get("/propertys/create", routeLock, create);
router.post(
  "/propertys/create",
  routeLock,
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

router.get("/propertys/add-image/:id", routeLock, addImage);

router.post(
  "/propertys/add-image/:id",
  routeLock,
  upload.single("image"),
  saveImage
);

export default router;
