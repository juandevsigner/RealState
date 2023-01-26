import express from "express";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import propertyRouter from "./routes/propertyRoutes.js";
import db from "./config/db.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csurf({ cookie: true }));

try {
  await db.authenticate();
  db.sync();
  console.log("----* Connection has been established successfully *----");
} catch (error) {
  console.error(error);
}

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

//ROUTING
app.use("/auth", userRouter);
app.use("/", propertyRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server online at port", port);
});
