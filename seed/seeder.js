import { exit } from "node:process";
import categories from "./categories.js";
import prices from "./prices.js";
import db from "../config/db.js";
import { Category, Price } from "../models/index.js";

const importData = async () => {
  try {
    await db.authenticate();

    await db.sync();

    await Promise.all([
      Category.bulkCreate(categories),
      Price.bulkCreate(prices),
    ]);

    console.log("--------Data Added Correctly--------");

    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

const deleteData = async () => {
  try {
    // await Promise.all([
    //   Category.destroy({ where: {}, truncate: true }),
    //   Price.destroy({ where: {}, truncate: true }),
    // ]) DELETE FOR LINE;

    await db.sync({ force: true });

    console.log("--------Data Deleted Correctly--------");

    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
}

if (process.argv[2] === "-r") {
  deleteData();
}
