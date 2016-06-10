import { socket } from './connect'

var datetime
var clock
// consultation
$('#simulate').submit(
  (e)=>{
    e.preventDefault()

    //recupération des valeurs de dataTime
    datetime = $('#datetime').data('date')
    clock  = $('#clock').data('date')

    // show le formulaire
    $('.formulaire').modal('toggle')
  }
)

$('#formReservation').submit(
(e)=>{
  e.preventDefault()
  let name = $('#nom').val()
  let prenom = $('#prenom').val()
  let email = $('#mail').val()
  let adress = $('#add').val()
  let cp = $('#cd').val()
  let ville = $('#ville').val()
  let company = $('#nomS').val()

  socket.emit(
    'generatePdf',
    {
      nom: name,
      prenom : prenom
    }
  );

  socket.emit(
    'sendMail',
    {
      subject : "facturation",
      destination : email,
      datetime : datetime,
      hours : clock,
      name: name,
      fname : prenom,
      adress : adress,
      CP : { num: cp, ville: ville },
      company : company
    }
  );
  console.log("email envoyé");
})
