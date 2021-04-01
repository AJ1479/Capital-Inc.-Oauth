const db = require("../models");
require("dotenv").config();
const User = db.user;

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

  res.json({ msg: 'successfully signed up' });
};