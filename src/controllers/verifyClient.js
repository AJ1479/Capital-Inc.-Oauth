const db = require("../models/index");
const Client = db.client;

const verifyClient = (req, res, next) => {
  return Client.findOne({
    where: { clientURL: req.body.clientURL },
  })
    .then((client) => {
      if(!client){
        return res.status(500).json('client unauthorised');
      }
      return res.status(200).json('verified client');
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).json('client unauthorised');
    });
};

module.exports = verifyClient;