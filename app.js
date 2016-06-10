/**
 * Created by anthonio on 09/06/2016.
 */
var http = require('http');
var fs = require('fs');
var pdf=require('pdfkit');


// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, nom) {


    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('getNom', function(nom) {
        socket.nom = nom;

    });

    socket.on('getPrenom', function(prenom) {
        socket.prenom = prenom;

    });

    socket.on('getadd', function(add) {
        socket.adresse = add;

    });

    socket.on('getville', function(ville) {
        socket.ville = ville;

    });

    socket.on('getcdpost', function(cd) {
        socket.codepostal = cd;

    });

    socket.on('getnb', function(nb) {
        socket.nombre = nb;

    });



    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function generator(){

        var x=getRandomInt(0,99);

        var generate=socket.nom+x;

        return generate;
    }














    // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
    socket.on('message', function (message) {
       

        console.log(socket.nom+socket.prenom+socket.adresse+socket.ville+socket.codepostal+socket.nombre);
       var myDoc=new pdf;

        var nomfacture= generator()+"Facture.pdf";
        myDoc.pipe(fs.createWriteStream(nomfacture));


        myDoc.font('Times-Roman')

            .fontSize(18)
            .text('Facturé à :     Monsieur, Madame', 50,100);



        myDoc.font('Times-Roman')

            .fontSize(18)
            .text(socket.nom+" "+socket.prenom, 295,100);

        myDoc.font('Times-Roman')

            .fontSize(18)
            .text(socket.adresse, 150,125);

        myDoc.font('Times-Roman')

            .fontSize(18)
            .text(socket.codepostal+" "+socket.ville, 150,150);




        myDoc.font('Times-Roman')

            .fontSize(16)
            .text('MERCI DE VOTRE CONFIANCE !', 175,600);



        myDoc.font('Times-Roman')

            .fontSize(45)
            .fillOpacity(0.4)
            .text('Facture', 400,10);



        myDoc.rect(50,200, 500,25)
            .lineWidth(3)
            .fillOpacity(8)
            .fillAndStroke("#AAFEF3", "black");

        myDoc.rect(50,225, 500,25)
            .lineWidth(3)
            .fillOpacity(8)
            .fillAndStroke("white", "black");

        myDoc.rect(50,300, 500,25)
            .lineWidth(3)
            .fillOpacity(8)
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

        var numFac= generator();

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

        var numFac= 3;

        myDoc.font('Times-Roman')
            .fillAndStroke("black", "black")
            .fillOpacity(80)
            .fontSize(12)
            .text(socket.nom,200,235);

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
            .text(socket.nombre,305,365);

        myDoc.font('Times-Roman')
            .fillAndStroke("black", "black")
            .fillOpacity(80)
            .fontSize(12)
            .text('MONTANT',455,310);

        var montant=socket.nombre*12.5;

        myDoc.font('Times-Roman')
            .fillAndStroke("black", "black")
            .fillOpacity(80)
            .fontSize(12)
            .text('€            '+montant, 455, 365)
            .text('SOUS-TOTAL              '+montant,370,460)
            .text('TAUX DE TVA        '+'10,00%',370,485)
            .text('TVA                              '+(montant/10),370,510)
            .text('TOTAL                         '+(montant+(montant/10)),370,535);





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

    });
});


server.listen(4200);

