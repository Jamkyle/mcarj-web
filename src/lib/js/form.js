import { socket } from './connect'

var datetime
var clock
var sits
var packs
// consultation
$('#simulate').submit(
  (e)=>{
    e.preventDefault()
    //recupération des valeurs de dataTime
    datetime = $('#datetime').data('date')
    clock  = $('#clock').data('date')
    sits  = $('#sits').val()
    packs  = $('#packs').val()
    // show le formulaire
    $('.formulaire').modal('toggle')
  }
)

$('#formReservation').submit(
(e) => {
  let name = $('#nom').val()
  let prenom = $('#prenom').val()
  let email = $('#mail').val()
  let adress = $('#add').val()
  let cp = $('#postal_code').val()
  let ville = $('#locality').val()
  let company = $('#nomS').val()

  socket.emit(
    'sendMail',
    {
      subject : "facturation",
      destination : email,
      datetime : datetime,
      hours : clock,
      name: name,
      fname : prenom,
      address : adress,
      CP : { num: cp, ville: ville },
      company : company,
      nombre : sits
    }
  );

  e.preventDefault()
  console.log("email envoyé");
})
