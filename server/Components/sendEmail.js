var nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');
var swig = require('swig');
var template = swig.compileFile('../server/template/template.html');


var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    xoauth2: xoauth2.createXOAuth2Generator({
      user: 'jstyle3003@gmail.com',
      clientId: '683711024292-410b1n66lipdvkr0pft77d3bhsm9tukv.apps.googleusercontent.com',
      clientSecret: '0gRMJ8igXVptg4SC99BHtc3c',
      refreshToken: "1/xLxp5hkZPr-Px32Ssi48_dMiPK8aKPhLMpWRcgBiQFc"
    })
  }
});

exports.sendMail = function(data){

  var mailOptions = {
    from: "jstyle3003@gmail.com",
    to: data.destination,
    subject: data.subject,
    generateTextFromHTML: true,
    html: template(data)
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(response);
    }
    smtpTransport.close();
  });
}
