import { Sequelize } from "sequelize";
import { Price, Category, Property } from "../models/index.js";

const home = async (req, res) => {
  const [prices, categories, homes, departments] = await Promise.all([
    Price.findAll({ raw: true }),
    Category.findAll({ raw: true }),
    Property.findAll({
      limit: 3,
      where: {
        categoryID: 1,
      },
      include: [
        { model: Price, as: "price" },
        { model: Category, as: "category" },
      ],
      order: [["createdAt", "DESC"]],
    }),
    Property.findAll({
      limit: 3,
      where: {
        categoryID: 2,
      },
      include: [
        { model: Price, as: "price" },
        { model: Category, as: "category" },
      ],
      order: [["createdAt", "DESC"]],
    }),
  ]);
  res.render("home", {
    page: "Home",
    prices,
    categories,
    homes,
    departments,
    csrfToken: req.csrfToken(),
  });
};

const categories = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByPk(id);
  if (!category) {
    return res.redirect("/404");
  }

  const properties = await Property.findAll({
    where: { categoryID: id },
    include: [
      { model: Price, as: "price" },
      { model: Category, as: "category" },
    ],
  });

  res.render("category", {
    page: `${category.name}s for sale`,
    properties,
    csrfToken: req.csrfToken(),
  });
};

const notFound = (req, res) => {
  res.render("404", {
    page: "Not Found",
    csrfToken: req.csrfToken(),
  });
};

const searchPage = async (req, res) => {
  const { term } = req.body;

  if (!term.trim()) {
    return res.redirect("back");
  }

  const properties = await Property.findAll({
    where: {
      title: {
        [Sequelize.Op.like]: "%" + term + "%",
      },
    },
    include: [{ model: Price, as: "price" }],
  });

  res.render("search", {
    page: "Search Result",
    properties,
    csrfToken: req.csrfToken(),
  });
};

export { home, categories, notFound, searchPage };
