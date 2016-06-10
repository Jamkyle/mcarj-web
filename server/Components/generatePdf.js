var http = require('http');
var fs = require('fs');
var pdf =require('pdfkit');
var _ = require('lodash');
var sendEmail = require('./sendEmail.js');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generator(name){ //génération d'un id

  var x=getRandomInt(0,99);

  var generate= name+x;

  return generate;
}


//reçoit en paramétre les données du formulaire de reservation
exports.generatePdf = function (data) {
  console.log(data);
  var myDoc= new pdf;
  var desti;
  const numFac = new Date().toISOString().slice(0, 19).replace(/[^0-9]/g, "")
  const nomfacture= "facture-"+generator(data.name)+".pdf";
  var writeStream = fs.createWriteStream(`./pdf/${nomfacture}`);
  ( data.company ) ? desti = data.company : desti = data.name+' '+data.fname;

  myDoc.pipe(writeStream);

  myDoc.font('Times-Roman')
  .fontSize(18)
  .text('Facturé à : ', 50,100);

  myDoc.font('Times-Roman')

  .fontSize(18)
  .text(desti, 150,100);

  myDoc.font('Times-Roman')

  .fontSize(18)
  .text(data.address, 150,125);

  myDoc.font('Times-Roman')

  .fontSize(18)
  .text(data.CP.num+" "+data.CP.ville, 150,150);




  myDoc.font('Times-Roman')

  .fontSize(16)
  .text('MERCI DE VOTRE CONFIANCE !', 175,600);



  myDoc.font('Times-Roman')

  .fontSize(45)
  .fillOpacity(0.4)
  .text('Facture', 400,10);



  myDoc.rect(50,200, 500,25)
  .lineWidth(3)
  .fillOpacity(5)
  .fillAndStroke("#AAFEF3", "black");

  myDoc.rect(50,225, 500,25)
  .lineWidth(3)
  .fillOpacity(8)
  .fillAndStroke("white", "black");

  myDoc.rect(50,300, 500,25)
  .lineWidth(3)
  .fillOpacity(5)
  .fillAndStroke("#AAFEF3", "black");

  myDoc.rect(50,325, 500,125)
  .lineWidth(3)
  .fillOpacity(8)
  .fillAndStroke("white", "black");

  myDoc.rect(450,450, 100,100)
  .lineWidth(3)
  .fillOpacity(8)
  .fillAndStroke("white", "black");



  //le numeros de facture utiliser fonction generate
  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('N° FACTURE',75,210);

  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text(numFac,75,235);

  //Recupenom du passager
  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('Nom du passagers',200,210);


  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text(data.name,200,235);

  //Recuperer la date de la course
  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('Date de Course',325,210);

  /**  OBTENIR LA DATE
  //  var a=now.getFullYear();
  var m=now.getMonth();
  var j=now.getDate();
  var d=a+m+j+" ";*/

  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text("date",325,235);

  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('Paiement',450,210);

  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('CB',450,235);

  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('DESIGNATION',150,310);

  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('Trajet',75,350)
  .text('Lieu de départ : Gare de Denfert', 75, 365)
  .text('Lieu débarquement : Aeroport Orly', 75, 380)

  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('Prix unitaire',380,310);

  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('€       12.5',380,365);

  //ON RECUPERA LE NOMBRE DE COMMADE
  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('Quantité',305,310);



  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text(data.nombre,305,365);

  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('MONTANT',455,310);

  var montant=data.nombre*12.5;
  var soustotal= montant * 0.9;

  myDoc.font('Times-Roman')
  .fillAndStroke("black", "black")
  .fillOpacity(80)
  .fontSize(12)
  .text('€            '+soustotal, 455, 365)
  .text('SOUS-TOTAL              '+soustotal,370,460)
  .text('TAUX DE TVA        '+'10,00%',370,485)
  .text('TVA                              '+(montant/10),370,510)
  .text('TOTAL                         '+(montant + soustotal),370,535);





  myDoc.lineCap('butt')
  .moveTo(175, 200)
  .lineTo(175, 250)
  .stroke();

  myDoc.lineCap('butt')
  .moveTo(300, 200)
  .lineTo(300, 250)
  .stroke();

  myDoc.lineCap('butt')
  .moveTo(425, 200)
  .lineTo(425, 250)
  .stroke();

  myDoc.lineCap('butt')
  .moveTo(300, 300)
  .lineTo(300, 450)
  .stroke();

  myDoc.lineCap('butt')
  .moveTo(450, 300)
  .lineTo(450, 450)
  .stroke();

  myDoc.lineCap('butt')
  .moveTo(375, 300)
  .lineTo(375, 450)
  .stroke();

  myDoc.lineCap('butt')
  .moveTo(450, 475)
  .lineTo(550, 475)
  .stroke();

  myDoc.lineCap('butt')
  .moveTo(450, 500)
  .lineTo(550, 500)
  .stroke();

  myDoc.lineCap('butt')
  .moveTo(450, 525)
  .lineTo(550, 525)
  .stroke();

  myDoc.lineCap('butt')
  .moveTo(450, 475)
  .lineTo(550, 475)
  .stroke();

  myDoc.lineCap('butt')
  .moveTo(50, 650)
  .lineTo(550, 650)
  .lineWidth(1)
  .fillAndStroke( "#5F9EA0")
  .stroke();




  myDoc.font('Times-Roman')

  .fontSize(8)
  .text('VROOMCAB est une marque déposée par la Société', 225,670);

  myDoc.font('Times-Roman')

  .fontSize(8)
  .text('69, rue de Glacière - 75013 PARIS', 250,685);

  myDoc.font('Times-Roman')

  .fontSize(8)
  .text('RCS 81103253100014 PARIS - REGISTRE EVTC075150104 - TVA intracom n°FR45811032531', 150,700);


  myDoc.end();
  writeStream.on('finish', function () {
    sendEmail.sendMail(data, nomfacture)
  });
}
