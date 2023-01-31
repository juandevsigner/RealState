import { validationResult } from "express-validator";
import { Price, Category, Property, Message, User } from "../models/index.js";
import { unlink } from "node:fs/promises";
import { isSeller, dateFormatter } from "../helpers/index.js";

const admin = async (req, res) => {
  const { page: currentPage } = req.query;

  const RegExp = /^[1-9]$/;

  if (!RegExp.test(currentPage)) {
    return res.redirect("/properties?page=1");
  }

  try {
    const { id } = req.user;

    const limit = 5;
    const offset = currentPage * limit - limit;

    const [properties, total] = await Promise.all([
      Property.findAll({
        limit,
        offset,
        where: { userId: id },
        include: [
          { model: Category, as: "category" },
          { model: Price, as: "price" },
          { model: Message, as: "messages" },
        ],
      }),
      Property.count({
        where: { userId: id },
      }),
    ]);

    res.render("properties/admin", {
      page: "My Properties",
      properties,
      csrfToken: req.csrfToken(),
      pages: Math.ceil(total / limit),
      currentPage: Number(currentPage),
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.log(error);
  }
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

const edit = async (req, res) => {
  const { id } = req.params;

  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/properties");
  }

  if (property.userID.toString() !== req.user.id.toString()) {
    return res.redirect("/properties");
  }

  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  console.log(property);

  res.render("properties/edit", {
    page: "Edit Property",
    csrfToken: req.csrfToken(),
    categories,
    prices,

    data: property,
  });
};

const saveChanges = async (req, res) => {
  let result = validationResult(req);

  if (!result.isEmpty()) {
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    res.render("properties/edit", {
      page: "Edit Property",
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: result.array(),
      data: req.body,
    });
  }

  const { id } = req.params;
  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/properties");
  }

  if (property.userID.toString() !== req.user.id.toString()) {
    return res.redirect("/properties");
  }

  try {
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

    property.set({
      title,
      description,
      wc,
      rooms,
      priceID,
      street,
      lat,
      lng,
      categoryID,
      parking,
    });

    await property.save();

    res.redirect("/properties");
  } catch (error) {
    console.log(error);
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/properties");
  }

  if (property.userID.toString() !== req.user.id.toString()) {
    return res.redirect("/properties");
  }

  await unlink(`public/uploads/${property.image}`);
  await property.destroy();
  res.redirect("/properties");
};

const changeState = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/properties");
  }

  if (property.userID.toString() !== req.user.id.toString()) {
    return res.redirect("/properties");
  }

  property.public = !property.public;
  await property.save();
  res.json({
    result: true,
  });
};

const showProperty = async (req, res) => {
  const { id } = req.params;

  const property = await Property.findByPk(id, {
    include: [
      { model: Price, as: "price" },
      { model: Category, as: "category" },
    ],
  });
  if (!property || !property.public) {
    return res.redirect("/404");
  }

  res.render("properties/show", {
    property,
    page: property.title,
    csrfToken: req.csrfToken(),
    user: req.user,
    isSeller: isSeller(req.user?.id, property.userID),
  });
};

const sendMessage = async (req, res) => {
  const { id } = req.params;

  const property = await Property.findByPk(id, {
    include: [
      { model: Price, as: "price" },
      { model: Category, as: "category" },
    ],
  });
  if (!property) {
    return res.redirect("/404");
  }

  let result = validationResult(req);

  if (!result.isEmpty()) {
    res.render("properties/show", {
      property,
      page: property.title,
      csrfToken: req.csrfToken(),
      user: req.user,
      isSeller: isSeller(req.user?.id, property.userID),
      errors: result.array(),
    });
  }

  const { message } = req.body;
  const { id: propertyID } = req.params;
  const { id: userID } = req.user;

  await Message.create({ message, propertyID, userID });

  res.redirect("/");
};

const viewMessages = async (req, res) => {
  const { id } = req.params;
  const property = await Property.findByPk(id, {
    include: [
      {
        model: Message,
        as: "messages",
        include: [{ model: User.scope("deletePassword"), as: "user" }],
      },
    ],
  });

  if (!property) {
    return res.redirect("/properties");
  }

  if (property.userID.toString() !== req.user.id.toString()) {
    return res.redirect("/properties");
  }

  res.render("properties/messages", {
    page: `Messages`,
    messages: property.messages,
    dateFormatter,
  });
};

export {
  admin,
  create,
  save,
  addImage,
  saveImage,
  edit,
  saveChanges,
  deleteProperty,
  changeState,
  showProperty,
  sendMessage,
  viewMessages,
};
