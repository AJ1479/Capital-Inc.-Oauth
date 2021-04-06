var JWT = require('jsonwebtoken');
const db = require("../models/index");
const User = db.user;
const Auth = db.auth;
const Client = db.client;
require("dotenv").config();

var bcrypt = require("bcryptjs");
var model = module.exports;

// based on https://github.com/thomseddon/node-oauth2-server/tree/master/examples/memory

var JWT_ISSUER = 'capitalincoauth';
var JWT_SECRET_FOR_ACCESS_TOKEN = process.env.JWT_SECRET_FOR_ACCESS_TOKEN
var JWT_SECRET_FOR_REFRESH_TOKEN = process.env.JWT_SECRET_FOR_REFRESH_TOKEN

// the expiry time of the oauth2-server settings and JWT settings should be the same
model.JWT_ACCESS_TOKEN_EXPIRY_SECONDS = process.env.JWT_ACCESS_TOKEN_EXPIRY_SECONDS;             // 30 minutes
model.JWT_REFRESH_TOKEN_EXPIRY_SECONDS = process.env.JWT_REFRESH_TOKEN_EXPIRY_SECONDS;         // 14 days

// Functions required to implement the model for oauth2-server

// generateToken
// This generateToken implementation generates a token with JWT.
// the token output is the Base64 encoded string.
model.generateToken = function(type, req, callback) {
  var token;
  var secret;
  var user = req.user;
  var clientId = req.body.client_id;
  var exp = new Date();
  var payload = {
    // public claims
    iss: JWT_ISSUER,   // issuer
//    exp: exp,        // the expiry date is set below - expiry depends on type
//    jti: '',         // unique id for this token - needed if we keep an store of issued tokens?
    // private claims
    userId: user.id,
    clientId: clientId
  };
  var options = {
    algorithms: ['HS256']  // HMAC using SHA-256 hash algorithm
  };

  if (type === 'accessToken') {
    secret = JWT_SECRET_FOR_ACCESS_TOKEN;
    exp.setSeconds(exp.getSeconds() + model.JWT_ACCESS_TOKEN_EXPIRY_SECONDS);
  } else {
    secret = JWT_SECRET_FOR_REFRESH_TOKEN;
    exp.setSeconds(exp.getSeconds() + model.JWT_REFRESH_TOKEN_EXPIRY_SECONDS);
  }
  payload.exp = exp.getTime();
token = JWT.sign(payload, secret, options);

  callback(false, token);
};

// The bearer token is a JWT, so we decrypt and verify it. We get a reference to the
// user in this function which oauth2-server puts into the req object
model.getAccessToken = function (bearerToken, callback) {

  return JWT.verify(bearerToken, JWT_SECRET_FOR_ACCESS_TOKEN, function(err, decoded) {
    if (err) {
      return callback(err, false);   // the err contains JWT error data
    }

    // other verifications could be performed here
    // eg. that the jti is valid

    // we could pass the payload straight out we use an object with the
    // mandatory keys expected by oauth2-server, plus any other private
    // claims that are useful
    return callback(false, {
      expires: new Date(decoded.exp),
      user: getUserById(decoded.userId)
    });
  });
};


// As we're using JWT there's no need to store the token after it's generated
model.saveAccessToken = function (accessToken, clientId, expires, userId, callback) {
  return callback(false);
};

// The bearer token is a JWT, so we decrypt and verify it. We get a reference to the
// user in this function which oauth2-server puts into the req object
model.getRefreshToken = function (bearerToken, callback) {
  return JWT.verify(bearerToken, JWT_SECRET_FOR_REFRESH_TOKEN, function(err, decoded) {

    if (err) {
      return callback(err, false);
    }
    // other verifications could be performed here
    // eg. that the jti is valid
    
    // instead of passing the payload straight out we use an object with the
    // mandatory keys expected by oauth2-server plus any other private
    // claims that are useful
    return callback(false, {
      expires: new Date(decoded.exp),
      user: decoded.userId,
      clientId: decoded.clientId
    });
  });
};

// required for grant_type=refresh_token
// As we're using JWT there's no need to store the token after it's generated
model.saveRefreshToken = function (refreshToken, clientId, expires, userId, callback) {
  return callback(false);
};

// authenticate the client specified by id and secret
model.getClient = async function (clientId, clientSecret, callback) {
   var client1 = await Client.findOne({
      where: {
        clientId: clientId
      }
    })
        if (client1 == null || client1.clientSecret == clientSecret) {
            return callback(false, client1);
        }
        return callback(false, false);
  };

// determine whether the client is allowed the requested grant type
model.grantTypeAllowed = function (clientId, grantType, callback) {
    callback(false, () => {
        if(grantType === 'password' || grantType === 'refresh_token'){
      if (grantType === "password") {
        Auth.findOne({
          where: {
            password: clientId
          }
        })
        .then(() => {
            return true
        })
        return false;
      }
      else {
        Auth.findOne({
          where: {
            refresh_token: clientId
          }
        })
      .then(()=> {return true})
      return false;
      }
    }
    return false;
})
}


// authenticate a user
// for grant_type password
model.getUser = function (username, password, callback) {
  for (var i = 0, len = users.length; i < len; i++) {
    var elem = users[i];
    if(elem.username === username && elem.password === password) {
      return callback(false, elem);
    }
  }
  callback(false, false);
};

model.getUser = async function (username, password, callback) {
    var user1 = await User.findOne({
      where: {
        email: username
      }
    })

    var passwordIsValid = bcrypt.compareSync(
      password,
      user1.password
    );
  
    if (!passwordIsValid) {
      return callback(false, false);
    }
  
    if (user1.isVerified == 0) {
      return callback(false, false);
    }
  
    callback(false, user1);
  
  };




let getUserById = async (userId) => {
  var hello = async function (){
    var user1 = await User.findOne({
        where: {
id: userId
        }
    })

    if(user1){
        return user1;
    }
    return null;
}
let result = await hello;
return result}

// for grant_type client_credentials
// given client credentials
//   authenticate client
//   lookup user
//   return that user...
//     oauth replies with access token and renewal token
//model.getUserFromClient = function(clientId, clientSecret, callback) {
//
//};