var nodemailer = require("nodemailer");
var fs = require('fs')
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var xoauth2 = require('xoauth2');
var path = require('path');
var swig = require('swig-email-templates');
var htmlToPdf = require('html-to-pdf');
var server = require('../server.js');
var Config = require('../config.js');

// var templatePdf = swig.compileFile('../server/template/htmltopdf.html');
// exports.generatePdf = function(data){
//   htmlToPdf.convertHTMLString(templatePdf(data), '../server/pdf/facturation-'+data.name+'.pdf',
//   function (error, success) {
//     if (error) {
//       console.log('Oh noes! Errorz!');
//       console.log(error);
//     } else {
//       console.log('Woot! Success!');
//       console.log(success);
//       sendMail(data)
//     }
//   }
// )
// }

exports.sendMail = function(data){
  var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      xoauth2: xoauth2.createXOAuth2Generator({
        user: Config.client.mail,
        clientId: Config.client.id,
        clientSecret: Config.client.secret,
        refreshToken: Config.client.token
      })
    }
  });

  var templates = new swig({
    root: path.join(__dirname, "../template")
  });

 templates.render('template.html', data, function(err, html, text) {

   var mailOptions = {
     from: Config.client.mail,
     to: data.destination,
     subject: data.subject,
     generateTextFromHTML: true,
     html: html,
     text: text,
     attachments: [{
       filename: 'facturation-'+data.attach,
       path: '../server/pdf/'+data.attach,
       contentType: 'application/pdf'
     }],
     function (err, info) {
       if(err){
         console.error(err);
         res.send(err);
       }
       else{
         console.log(info);
         res.send(info);
       }
     }
   };
   // Send email
   smtpTransport.sendMail(mailOptions, (err, res) => {
     if(err)
      console.log(err);
      else {
          console.log(res);
          server.socket.emit('send_success')
      }
      smtpTransport.close()
   });

});

  //   smtpTransport.sendMail(mailOptions, function(error, response) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log(response);
  //     }
  //     smtpTransport.close();
  //   });
  //   console.log(err);

}
