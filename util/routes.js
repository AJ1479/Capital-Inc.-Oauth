//POST /signup
const app = require('express').Router();
const SignUpController = require('./SignUpController');
const VerificationController = require('./VerificationController');

app.post('/signup', SignUpController);


// POST /verication?token=[string]&email=[string]
app.get('/verification', VerificationController);

module.exports = app;