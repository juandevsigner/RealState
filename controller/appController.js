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
  });
};

const notFound = (req, res) => {};

const searchPage = (req, res) => {};

export { home, categories, notFound, searchPage };
