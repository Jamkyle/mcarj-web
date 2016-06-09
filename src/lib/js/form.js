import { socket } from './connect'

$('#formReservation').submit(
(e)=>{
  e.preventDefault()
  let datetime = $('#datetime')
  let clock  = $('#clock')

  console.log(clock.val());
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
      content: '<h1>Bonjour monsieur '+ name +' '+ prenom +'</h1> <p> retrouvez votre facturation dans une piece ci-jointe</p>'
    }
  );
  console.log("email envoyé");
})


// consultation
$('#simulate').submit(
  ()=>{
    $('.formulaire').modal('toggle')
  }
)
