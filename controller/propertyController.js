import { validationResult } from "express-validator";
import { Price, Category, Property } from "../models/index.js";

const admin = async (req, res) => {
  res.render("propertys/admin", {
    page: "My Propertys",
    header: true,
  });
};

const create = async (req, res) => {
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("propertys/create", {
    page: "Create Property",
    header: true,
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

    res.render("propertys/create", {
      page: "Create Property",
      header: true,
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
    });
  } catch (error) {
    console.log(error);
  }
};

export { admin, create, save };
