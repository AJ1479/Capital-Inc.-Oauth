const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const app = require('express').Router();

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.post(
  "/api/auth/signup",
  [
    verifySignUp.checkDuplicateEmail,
  ],
  controller.signup
);

module.exports = app;