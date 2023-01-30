import { validationResult } from "express-validator";
import { Price, Category, Property } from "../models/index.js";
import router from "../routes/propertyRoutes.js";

const admin = async (req, res) => {
  const { id } = req.user;
  const properties = await Property.findAll({
    where: { userId: id },
    include: [
      { model: Category, as: "category" },
      { model: Price, as: "price" },
    ],
  });

  res.render("properties/admin", {
    page: "My Properties",
    properties,
  });
};

const create = async (req, res) => {
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/create", {
    page: "Create Property",
    csrfToken: req.csrfToken(),
    categories,
    prices,
    data: {},
  });
};

const save = async (req, res) => {
  let result = validationResult(req);

  if (!result.isEmpty()) {
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    res.render("properties/create", {
      page: "Create Property",
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: result.array(),
      data: req.body,
    });
  }

  const {
    title,
    description,
    wc,
    rooms,
    price: priceID,
    street,
    lat,
    lng,
    category: categoryID,
    parking,
  } = req.body;

  try {
    const propertySave = await Property.create({
      title,
      description,
      categoryID,
      priceID,
      rooms,
      parking,
      wc,
      street,
      lat,
      lng,
      userID: req.user.id,
      image: "",
      public: false,
    });
    const { id } = propertySave;
    res.redirect(`/properties/add-image/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const addImage = async (req, res) => {
  const { id } = req.params;

  const property = await Property.findByPk(id);
  if (!property) {
    return res.redirect("/properties");
  }

  if (property.public) {
    return res.redirect("/properties");
  }

  if (req.user.id.toString() !== property.userID.toString()) {
    return res.redirect("/properties");
  }

  res.render("properties/add-image", {
    page: `Add Image ${property.title}`,
    csrfToken: req.csrfToken(),
    property,
  });
};

const saveImage = async (req, res, next) => {
  const { id } = req.params;

  const property = await Property.findByPk(id);
  if (!property) {
    return res.redirect("/properties");
  }

  if (property.public) {
    return res.redirect("/properties");
  }

  if (req.user.id.toString() !== property.userID.toString()) {
    return res.redirect("/properties");
  }

  try {
    property.image = req.file.filename;
    property.public = 1;
    await property.save();
    next();
  } catch (error) {
    console.log(error);
  }
};

export { admin, create, save, addImage, saveImage };
