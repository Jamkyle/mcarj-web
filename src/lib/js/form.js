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
    // let day = datetimepicker.date().date()
    // let month = datetimepicker.date().month()
    // let year = $('#datetime').data('DateTimePicker').date().year()
    let hours = $('#clock').data('DateTimePicker').date().hours()
    let minutes = $('#clock').data('DateTimePicker').date().minutes()
    // if(moment() < moment(datetime).hours(clock))
    // moment().date(day).month(month).year(year).hours(hours).minutes(minutes)
      if( moment() < datetimepicker.getMoment(datetime).hours(hours).minutes(minutes)
          && datetimepicker.getMoment().isValid()
          && hours >= 6 && hours <20
        )
        {
          sits  = $('#sits').val()
          packs  = $('#packs').val()
          // show le formulaire

          $('.formulaire').modal('show')
          $('#date_depart').text(datetime+' à '+clock)
          $('#price').text(sits*12.5+' €')
          $('#nbsits').text(sits)
          $('#bagage').text(packs)
          e.preventDefault()
        }
      else
        {
          $('.alert-danger').show()

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

  socket.on('send_success', (message) => {
    $('.alert').removeClass('hidden')
    setTimeout(()=>{ $('.formulaire').modal('hide'); $('.alert').addClass('hidden') }, 1000)
  } )

  e.preventDefault()

})
