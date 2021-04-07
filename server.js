var express = require('express');
var bodyParser = require('body-parser');
var oauthserver = require('oauth2-server');
var memorystore = require('./src/middleware/model.js');

const cors = require("cors");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = require("./src/models/index");

db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

const router = require('./src/router'); // sign-up route
app.use(router);

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

if (process.env.MODE === 'dev') {
  app.get('/test', (req, res) => {
    const x = require('./src/models/db.config');
    const y = x.client;
    const z = x.auth;
    z.create({
      password: 'secret',
      refresh_token: 'secret'
    })

  })
}

app.use(app.oauth.errorHandler());

app.listen(process.env.PORT, () => {
  console.log('server started');
});