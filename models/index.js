import Property from "./Property.js";
import Category from "./Category.js";
import Price from "./Price.js";
import User from "./User.js";

Property.belongsTo(Price, { foreignKey: "priceID" });
Property.belongsTo(Category, { foreignKey: "categoryID" });
Property.belongsTo(User, { foreignKey: "userID" });

export { Property, Price, Category, User };
