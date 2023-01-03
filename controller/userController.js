import { check, validationResult } from "express-validator";
import { createId } from "../helpers/tokens.js";
import User from "../models/User.js";
import { emailRegister } from "../helpers/emails.js";

//VIEWS
const formLogin = (req, res) => {
  res.render("auth/login", {
    page: "Login",
  });
};

const formRegister = (req, res) => {
  res.render("auth/register", {
    page: "Create Account",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = (req, res) => {
  res.render("auth/reset-password", {
    page: "Reset Password",
  });
};

//ENDPOINTS
const register = async (req, res) => {
  await check("name").notEmpty().withMessage("Name is required").run(req);

  await check("email").isEmail().withMessage("Email no valid").run(req);

  await check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters")
    .run(req);

  await check("password2")
    .equals(req.body.password)
    .withMessage("Passwords are not same")
    .run(req);

  let result = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("auth/register", {
      page: "Create Account",
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  const { name, email, password } = req.body;

  const userExist = await User.findOne({ where: { email } });

  if (userExist) {
    return res.render("auth/register", {
      page: "Create Account",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "The user already exists" }],
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    token: createId(),
  });

  emailRegister({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  res.render("templates/message", {
    msg: "Account created successfully, we send you a message to confirm, click on link to confirm",
    page: "Account has been created correctly",
  });
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ where: { token } });
  if (!user) {
    return res.render("auth/confirm-account", {
      page: "Error: Token not valid",
      msg: "Error to confirm your account, try again later",
      error: true,
    });
  }

  user.token = null;
  user.confirm = true;
  await user.save();
  return res.render("auth/confirm-account", {
    page: "Succes: Done!",
    msg: "Account confirmation successful",
    error: false,
  });
};

export { formLogin, formRegister, resetPassword, register, confirm };
