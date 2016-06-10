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
      fname : prenom
    }
  );
  console.log("email envoyé");
})
