require('dotenv').config()
const sendGrid = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SendGridApiKey);
const sendVerificationEmail = (to, token) => {
    const hostUrl = "https://api.sendgrid.com";
    const request = sg.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: {
        personalizations: [
          {
            to: [
              {
                email: to
              }
            ],
            subject: "Click the link to update your password"
          }
        ],
        from: {
          email: "me@davidvelho.tech"
        },
        content: [
      {
        type: 'text/plain',
        value: `http://localhost:3000/verify?email=${to}&Authorization=${token}`
      }
    ]
      }
    });
    return new Promise(function (resolve, reject) {
      sg.API(request, function (error, response) {
        if (error) {
          return reject(error);
        }
        else {
          return resolve(response);
        }
      });
    });
  };


module.exports = sendVerificationEmail;