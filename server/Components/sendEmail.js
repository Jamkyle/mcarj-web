var nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');
var path = require('path');
var swig = require('swig-email-templates');
var htmlToPdf = require('html-to-pdf');
var server = require('../server.js')

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

exports.sendMail = function(data, attach){

  var templates = new swig({
    root: path.join(__dirname, "../template")
  });

 templates.render('template.html', data, function(err, html, text) {

   var mailOptions = {
     from: "jstyle3003@gmail.com",
     to: data.destination,
     subject: data.subject,
     generateTextFromHTML: true,
     html: html,
     text: text,
     attachments: [{
       filename: 'facturation-'+attach,
       path: '../server/pdf/'+attach,
       contentType: 'application/pdf'
     }], function (err, info) {
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
          server.socket.emit('send_success', 'Votre email a bien été envoyé')
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
