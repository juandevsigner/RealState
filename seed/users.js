import bcrypt from "bcrypt";

const users = [
  {
    name: "Mariangel",
    email: "maria@maria.com",
    confirm: 1,
    password: bcrypt.hashSync("1234567", 10),
  },
  {
    name: "Juan Da",
    email: "juanda@juanda.com",
    confirm: 1,
    password: bcrypt.hashSync("1234567", 10),
  },
  {
    name: "Yeka",
    email: "yeka@yeka.com",
    confirm: 1,
    password: bcrypt.hashSync("1234567", 10),
  },
  {
    name: "Emma",
    email: "emma@emma.com",
    confirm: 1,
    password: bcrypt.hashSync("1234567", 10),
  },
];

export default users;
