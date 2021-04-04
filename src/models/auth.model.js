module.exports = (sequelize, Sequelize) => {
  const Auth = sequelize.define("auth", {
    password: {
      type: Sequelize.STRING
    },
    refresh_token: {
      type: Sequelize.STRING
    },
  });

  return Auth;
};