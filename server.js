var express = require('express');
var bodyParser = require('body-parser');
var oauthserver = require('oauth2-server');
var memorystore = require('./model.js');

const cors = require("cors");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = require("./app/models");

db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

const authRoutes = require('./app/routes/auth.routes'); // sign-up route
app.use(authRoutes);

const auth = require('./util/routes'); // sign-up route
app.use(auth);

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

if(process.env.MODE === 'dev'){
app.get('/test', (req, res) => {
  const x = require('./app/models');
  const y = x.client;
  const z = x.auth;
  z.create({
    password: 'secret',
    refresh_token: 'secret'
  })

})
}

app.use(app.oauth.errorHandler());

app.listen(3000, () => {
  console.log('server started');
});