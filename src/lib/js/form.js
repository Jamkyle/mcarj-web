import { socket } from './connect'

var datetime
var clock
var sits
var packs
// consultation
$('#simulate').submit(
  (e)=>{

    //recupération des valeurs de dataTime
    datetime = $('#datetime').data('date')
    clock  = $('#clock').data('date')
    let datetimepicker = $('#datetime').data('DateTimePicker')
    let day = datetimepicker.date().date()
    let month = datetimepicker.date().month()
    let year = $('#datetime').data('DateTimePicker').date().year()
    let hours = $('#clock').data('DateTimePicker').date().hours()
    let minutes = $('#clock').data('DateTimePicker').date().minutes()
    // if(moment() < moment(datetime).hours(clock))
      if( moment() < moment().date(day).month(month).year(year).hours(hours).minutes(minutes)
          && datetimepicker.getMoment().isValid()
          && hours >= 6 && hours <20
        )
        {
          sits  = $('#sits').val()
          packs  = $('#packs').val()
          // show le formulaire
          $('.formulaire').modal('toggle')
          $('#date_depart').text(datetime+' à '+clock)
          e.preventDefault()
        }
      else
        {
          e.preventDefault()

        }



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
