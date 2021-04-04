const db = require("../models/index");
const User = db.user;
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

function authenticateToken(req, res) {
    const token = req.query.Authorization;
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      console.log(req.query.email)
  
      if (err) {
        return res.sendStatus(403)}
  
     if (req.query.email == user.email){
        return true;
     }
    })
    return true;
  }

const VerificationController = (req, res) => {
  console.log(req.query.email)
    return User.findOne({
      where: { email: req.query.email }
    })
      .then(user => {
        if (user.isVerified) {
          return res.status(202).json(`Email Already Verified`);
        } else {

          if (authenticateToken(req, res))
            {
              user.update({
                isVerified: true
              })
                  .then((updatedUser) => {
                    return res.status(200).json(`User with ${user.email} has been verified`);
                  })
                  .catch(reason => {
                    return res.status(403).json(`Verification failed`);
                  });
              }
        }
      })
      .catch(reason => {
        return res.status(404).json(`Email not found`);
      });
}
module.exports = VerificationController;