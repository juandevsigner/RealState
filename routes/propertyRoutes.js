import { Router } from "express";
import { body } from "express-validator";
import {
  admin,
  create,
  save,
  addImage,
  saveImage,
  saveChanges,
  edit,
  deleteProperty,
  changeState,
  showProperty,
  sendMessage,
  viewMessages,
} from "../controller/propertyController.js";
import checkUser from "../middleware/checkUser.js";
import routeLock from "../middleware/routeLock.js";
import upload from "../middleware/uploadImage.js";

const router = Router();

router.get("/properties", routeLock, admin);
router.get("/properties/create", routeLock, create);
router.post(
  "/properties/create",
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

router.get("/properties/add-image/:id", routeLock, addImage);

router.post(
  "/properties/add-image/:id",
  routeLock,
  upload.single("image"),
  saveImage
);

router.get("/properties/edit/:id", routeLock, edit);

router.post(
  "/properties/edit/:id",
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
  saveChanges
);

router.post("/properties/delete/:id", routeLock, deleteProperty);

router.put("/properties/:id", routeLock, changeState);

//PUBLIC PAGES

router.get("/property/:id", checkUser, showProperty);

router.post(
  "/property/:id",
  checkUser,
  body("message")
    .isLength({ min: 10 })
    .withMessage(
      "The message is mandatory and must be at least 10 characters long."
    ),
  sendMessage
);

router.get("/messages/:id", routeLock, viewMessages);

export default router;
