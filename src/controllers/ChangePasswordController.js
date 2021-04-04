const db = require("../models/index");
const User = db.user;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
var bcrypt = require("bcryptjs");

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

function authenticateToken(req, res) {
    const token = req.body.token;
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(req.body.email)
  
      if (err) {
        return res.sendStatus(403)}
  
     if (req.body.email == user.email){
        return true;
     }
    })
    return true;
  }

const ChangePasswordController = (req, res) => {
    return User.findOne({
      where: { email: req.body.email }
    })
      .then(user => {
          if (authenticateToken(req, res))
            {
              user.update({
                password: bcrypt.hashSync(req.body.password, 8),
                isVerified: true
              })
                  .then((updatedUser) => {
                    return res.status(200).json(`Password for ${user.email} has been updated`);
                  })
                  .catch(reason => {
                    return res.status(403).json(`Update failed`);
                  });
              }
        })
    .catch(reason => {
        return res.status(404).json(`Email not found`);
      });
}
module.exports = ChangePasswordController;