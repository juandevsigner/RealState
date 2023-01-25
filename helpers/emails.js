import nodemailer from "nodemailer";

const emailRegister = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  await transport.sendMail({
    from: "Real State",
    to: email,
    subject: "Confirm registration",
    text: `Confirm registration`,
    html: `<p>Hello ${name},\n\nPlease confirm your email address by clicking the link</p>
        <p>Your account is ready, now you just need to confirm when you hit the link below:
        <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/confirm/${token}">Confirm Acount</a></p>

        <p>If you did not create this account please ignore this email</p>
    `,
  });
};

const emailResetPassword = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, name, token } = data;

  await transport.sendMail({
    from: "Real State",
    to: email,
    subject: "Reset Password",
    text: `Reset Password`,
    html: `<p>Hello ${name},\n\nYou need change your password</p>
        <p>Follow link to create a new password:
        <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/reset-password/${token}">Change password</a></p>

        <p>If you did not create this account please ignore this email</p>
    `,
  });
};

export { emailRegister, emailResetPassword };
