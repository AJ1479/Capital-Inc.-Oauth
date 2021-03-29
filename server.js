var express = require('express');
var bodyParser = require('body-parser');
var oauthserver = require('oauth2-server');
var memorystore = require('./model.js');
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const cors = require("cors");

var app = express();

const db = require("./app/models");

db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.oauth = oauthserver({
  model: memorystore,
  grants: ['password', 'refresh_token'],
  debug: true,
  accessTokenLifetime: memorystore.JWT_ACCESS_TOKEN_EXPIRY_SECONDS,   // expiry time in seconds, consistent with JWT setting in model.js
  refreshTokenLifetime: memorystore.JWT_REFRESH_TOKEN_EXPIRY_SECONDS   // expiry time in seconds, consistent with JWT setting in model.js
});

app.all('/oauth/token', app.oauth.grant());

app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Secret area');
});

app.use(app.oauth.errorHandler());

app.listen(3000);