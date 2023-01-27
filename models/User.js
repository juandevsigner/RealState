import DataType from "sequelize";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const User = db.define(
  "users",
  {
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
    },
    token: DataType.STRING,
    confirm: DataType.BOOLEAN,
  },
  {
    hooks: {
      beforeCreate: async function (user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
    scopes: {
      deletePassword: {
        attributes: {
          exclude: ["password", "token", "confirm", "createdAt", "updatedAt"],
        },
      },
    },
  }
);

User.prototype.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default User;
