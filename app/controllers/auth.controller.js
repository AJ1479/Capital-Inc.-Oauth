const db = require("../models");
require("dotenv").config();
const config = `${process.env.JWT_SECRET_FOR_ACCESS_TOKEN}`;
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })

    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};