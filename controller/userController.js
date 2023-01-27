import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { createId, createJWT } from "../helpers/tokens.js";
import User from "../models/User.js";
import { emailRegister, emailResetPassword } from "../helpers/emails.js";

//VIEWS
const formLogin = (req, res) => {
  res.render("auth/login", {
    page: "Login",
    csrfToken: req.csrfToken(),
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
    csrfToken: req.csrfToken(),
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

const resetPasswordEndPoint = async (req, res) => {
  await check("email").isEmail().withMessage("Email no valid").run(req);

  let result = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("auth/reset-password", {
      page: "Reset Password",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.render("auth/reset-password", {
      page: "Reset Password",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "Email does not exist" }],
    });
  }

  user.token = createId();
  await user.save();
  emailResetPassword({
    email: user.email,
    name: user.name,
    token: user.token,
  });

  res.render("templates/message", {
    msg: "Reset Password",
    page: "We seend you an email with instructions",
  });
};

const checkToken = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ where: { token } });

  if (!user) {
    return res.render("auth/confirm-account", {
      page: "Reset Password",
      msg: "Error to confirm your account, try again later",
      error: true,
    });
  }

  res.render("auth/change-password", {
    page: "Change Password",
    csrfToken: req.csrfToken(),
  });
};

const newPassword = async (req, res) => {
  await check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters")
    .run(req);

  let result = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("auth/change-password", {
      page: "Change Password",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ where: { token } });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.token = null;

  await user.save();

  res.render("auth/confirm-account", {
    page: "Change Password Correctly",
    msg: "New Password Save",
  });
};

const validateUser = async (req, res) => {
  await check("email").isEmail().withMessage("Email no valid").run(req);

  await check("password")
    .notEmpty()
    .withMessage("Password is required")
    .run(req);

  let result = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("auth/login", {
      page: "Login",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.render("auth/login", {
      page: "Login",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "User not found" }],
    });
  }

  if (!user.confirm) {
    return res.render("auth/login", {
      page: "Login",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "User not confirmed" }],
    });
  }

  if (user.verifyPassword(password)) {
    return res.render("auth/login", {
      page: "Login",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "Password is not valid" }],
    });
  }

  const token = createJWT({ id: user.id, name: user.name });

  return res
    .cookie("_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    })
    .redirect("/propertys");
};

export {
  formLogin,
  formRegister,
  resetPassword,
  register,
  confirm,
  resetPasswordEndPoint,
  checkToken,
  newPassword,
  validateUser,
};
