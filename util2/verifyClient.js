const db = require("../app/models/index");
const Client = db.client;

const verifyClient = (req, res, next) => {
  return Client.findOne({
    where: { clientURL:  req.body.clientURL },
  })
  .then(() => {
      console.log('hi');
        return res.status(200).json('verified client');
      })
.catch((error) => {
    console.log(error)
        return res.status(500).json('client unauthorised');
      });
};

module.exports = verifyClient;