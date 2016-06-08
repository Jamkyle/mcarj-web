
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generator(){
    var nom=document.getElementById('nom'),
        nomValue=nom.value;

    var prenom=document.getElementById('prenom'),
        prenomValue=prenom.value;

    var x=getRandomInt(0,99);

    var generate=nomValue+prenomValue+x;

    return generate;
}



// Fonction de désactivation de l'affichage des "tooltips"
function deactivateTooltips() {

    var tooltips = document.querySelectorAll('.tooltip'),
        tooltipsLength = tooltips.length;

    for (var i = 0; i < tooltipsLength; i++) {
        tooltips[i].style.display = 'none';
    }

}


// La fonction ci-dessous permet de récupérer la "tooltip" qui correspond à notre input

function getTooltip(elements) {

    while (elements = elements.nextSibling) {
        if (elements.className === 'tooltip') {
            return elements;
        }
    }

    return false;

}


// Fonctions de vérification du formulaire, elles renvoient "true" si tout est ok

var check = {}; // On met toutes nos fonctions dans un objet littéral

check['nmb'] = function() {

    var nmb = document.getElementsByName('nmb'),
        tooltipStyle = getTooltip(nmb[1].parentNode).style;

    if (nmb[0].checked || nmb[1].checked || nmb[2].checked || nmb[3].checked) {
        tooltipStyle.display = 'none';
        return true;
    } else {
        tooltipStyle.display = 'inline-block';
        return false;
    }

};

check['nom'] = function(id) {

    var name = document.getElementById(id),
        tooltipStyle = getTooltip(name).style;

    if (name.value.length >= 2) {
        name.className = 'correct';
        tooltipStyle.display = 'none';
        return true;
    } else {
        name.className = 'incorrect';
        tooltipStyle.display = 'inline-block';
        return false;
    }

};

check['prenom'] = check['nom']; // La fonction pour le prénom est la même que celle du nom
check['add'] = check['nom'];
check['ville'] = check['nom'];

check['tel'] = function() {

    var tel = document.getElementById('tel'),
        tooltipStyle = getTooltip(tel).style,
        telValue = parseInt(tel.value);

    if (!isNaN(telValue) && telValue >= 0600000000 && telValue <= 0799999999) {
        tel.className = 'correct';
        tooltipStyle.display = 'none';
        return true;
    } else {
        tel.className = 'incorrect';
        tooltipStyle.display = 'inline-block';
        return false;
    }

};

check['mail'] = function() {

    var mail = document.getElementById('mail'),
        tooltipStyle = getTooltip(mail).style;

    if (mail.value.length >= 4) {
        mail.className = 'correct';
        tooltipStyle.display = 'none';
        return true;
    } else {
        mail.className = 'incorrect';
        tooltipStyle.display = 'inline-block';
        return false;
    }

};

check['cd'] = function() {

    var cd = document.getElementById('cd'),
        tooltipStyle = getTooltip(cd).style,
        cdValue = parseInt(cd.value);

    if (!isNaN(cdValue) && cdValue >= 970 && cdValue <= 98999) {
        cd.className = 'correct';
        tooltipStyle.display = 'none';
        return true;
    } else {
        cd.className = 'incorrect';
        tooltipStyle.display = 'inline-block';
        return false;
    }

};

check['hr'] = function() {

    var hr = document.getElementById('hr'),
        tooltipStyle = getTooltip(hr).style;

    if (hr.options[hr.selectedIndex].value != 'none') {
        tooltipStyle.display = 'none';
        return true;
    } else {
        tooltipStyle.display = 'inline-block';
        return false;
    }

};




/**check['date'] = function() {

    var date = document.getElementById('date'),
        dateValue=date.value,
        tooltipStyle = getTooltip(date).style;

    if (dateValue != 'none') {
        tooltipStyle.display = 'none';
        return true;
    } else {
        tooltipStyle.display = 'inline-block';
        return false;
    }

};*/


//fonction qui creer notre facture



function Creepdf() {
    var pdf=require('pdfkit');
    var fs=require('fs');

    var myDoc=new pdf;

    myDoc.pipe(fs.createWriteStream('facture.pdf'));

    myDoc.font('Times-Roman')

        .fontSize(21)
        .text('Facturé à :', 50,150);

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

    var numFac= 3;

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
        .text(numFac,200,235);

//Recuperer la date de la course
    myDoc.font('Times-Roman')
        .fillAndStroke("black", "black")
        .fillOpacity(80)
        .fontSize(12)
        .text('Date de Course',325,210);

    var numFac= 3;

    myDoc.font('Times-Roman')
        .fillAndStroke("black", "black")
        .fillOpacity(80)
        .fontSize(12)
        .text(numFac,325,235);

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
        .text('€       13',380,365);

//ON RECUPERA LE NOMBRE DE COMMADE
    myDoc.font('Times-Roman')
        .fillAndStroke("black", "black")
        .fillOpacity(80)
        .fontSize(12)
        .text('Quantité',305,310);

    var qt=0;

    myDoc.font('Times-Roman')
        .fillAndStroke("black", "black")
        .fillOpacity(80)
        .fontSize(12)
        .text(qt,305,365);

    myDoc.font('Times-Roman')
        .fillAndStroke("black", "black")
        .fillOpacity(80)
        .fontSize(12)
        .text('MONTANT',455,310);

    var montant=qt*13;

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
}






















// Mise en place des événements

(function() { // Utilisation d'une IIFE pour éviter les variables globales.

    var myForm = document.getElementById('myForm'),
        inputs = document.querySelectorAll('input[type=text], input[type=password]'),
        inputsLength = inputs.length;

    for (var i = 0; i < inputsLength; i++) {
        inputs[i].addEventListener('keyup', function(e) {
            check[e.target.id](e.target.id); // "e.target" représente l'input actuellement modifié
        });
    }

    myForm.addEventListener('submit', function(e) {

        var result = true;

        for (var i in check) {
            result = check[i](i) && result;
        }

        if (result) {
            alert('Le formulaire est bien rempli.');
            Creepdf();
        }

        e.preventDefault();

    });

    myForm.addEventListener('reset', function() {

        for (var i = 0; i < inputsLength; i++) {
            inputs[i].className = '';
        }

        deactivateTooltips();

    });

})();


// Maintenant que tout est initialisé, on peut désactiver les "tooltips"

deactivateTooltips();
