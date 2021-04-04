//POST /signup
const app = require('express').Router();
const SignUpController = require('./controllers/SignUpController');
const VerificationController = require('./controllers/VerificationController');
const ForgotPasswordController = require('./controllers/ForgotPasswordController');
const ChangePasswordController = require('./controllers/ChangePasswordController')
const verifyClient = require('./controllers/verifyClient')

app.post('/signup', SignUpController);


// POST /verication?token=[string]&email=[string]
app.get('/verification', VerificationController);

app.post('/forgotpassword', ForgotPasswordController);

app.get('/update', ChangePasswordController);
app.get('/verify', (req,res) => {
    res.sendFile(__dirname + '/views/index.html');});
app.post('/verify', ChangePasswordController);
app.post('/verifyClient', verifyClient);
module.exports = app;