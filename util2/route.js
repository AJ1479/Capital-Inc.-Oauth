//POST /signup
const app = require('express').Router();
const ForgotPasswordController = require('./ForgotPasswordController');
const ChangePasswordController = require('./ChangePasswordController')
const verifyClient = require('./verifyClient')

app.post('/forgotpassword', ForgotPasswordController);

app.get('/update', ChangePasswordController);
app.get('/verify', (req,res) => {
    res.sendFile(__dirname + '/index.html');});
app.post('/verify', ChangePasswordController);
app.post('/verifyClient', verifyClient);
module.exports = app;