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
            subject:"Verify Your Email"
          }
        ],
        from: {
          email: "me@davidvelho.tech"
        },
        content: [
      {
        type: 'text/plain',
        value: `http://localhost:3000/verification?email=${to}&Authorization=Bearer%20${token}`
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