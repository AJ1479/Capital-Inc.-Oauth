const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
var bcrypt = require("bcryptjs");
// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

function generateAccessToken(useremail) {
    return jwt.sign(useremail, process.env.TOKEN_SECRET, { expiresIn: '86400s' });
  }

const sendVerificationEmail = require('../middleware/SendGridEmailHelper');
const db = require("../models/index");
const User = db.user;

const ForgotPasswordController = (req, res, next) => {
  console.log(User)
  return User.findOne({
    where: { email:  req.body.email },
  })
  .then((user) => {
        const token = generateAccessToken({ email: user.email });
        sendVerificationEmail(user.email, token, 'verify');
        return res.status(200).json('reset link sent');
      })
.catch((error) => {
        return res.status(500).json('error');
      });
};

module.exports = ForgotPasswordController;