import Property from "./Property.js";
import Category from "./Category.js";
import Price from "./Price.js";
import User from "./User.js";
import Message from "./Message.js";

Property.belongsTo(Price, { foreignKey: "priceID" });
Property.belongsTo(Category, { foreignKey: "categoryID" });
Property.belongsTo(User, { foreignKey: "userID" });
Property.hasMany(Message, { foreignKey: "propertyID" });

Message.belongsTo(Property, { foreignKey: "propertyID" });
Message.belongsTo(User, { foreignKey: "userID" });

export { Property, Price, Category, User, Message };
