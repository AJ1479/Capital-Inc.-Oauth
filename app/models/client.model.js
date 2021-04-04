module.exports = (sequelize, Sequelize) => {
    const Client = sequelize.define("clients", {
      clientId: {
        type: Sequelize.STRING
      },
      clientSecret: {
        type: Sequelize.STRING
      },
      clientURL: {
        type: Sequelize.STRING
      }
    });
  
    return Client;
  };