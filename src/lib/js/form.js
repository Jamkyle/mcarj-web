import { socket } from './connect'

var datetime
var clock
var sits
var packs
// consultation
$('a.close').click(e =>{
  let current = e.target.dataset.target
  $('body').find('[data-name='+current+']').hide()
})

$('#simulate').submit(
  (e)=>{

    //recupération des valeurs de dateTime
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
          $('#simulate').find('[data-name=datetime]').hide()
          e.preventDefault()
        }
      else
        {
          $('#simulate').find('[data-name=datetime]').show()
          e.preventDefault()

        }
  }
)
// apres le focus du champs telephone check le num tel
$('#tel').on('change', (e)=>{
  console.log();
  if( e.target.value.length === 10 && !isNaN(e.target.value) || /^(0|\+33)? [1-9]([-. ]?[0-9]{2}){4}$/.test(e.target.value) ){

    e.target.value = e.target.value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
    e.target.value = e.target.value.replace(/^0/g, "+33 ")
    $('#simulate').find('[data-name=tel]').hide()
    $('#tel').parent().removeClass('has-error')
    $('#tel').parent().addClass('has-success')

  }
  else {
    $('#tel').parent().addClass('has-error')
    $('#simulate').find('[data-name=tel]').show()
  }
})

//au submit du formulaire de réservation
$('#formReservation').submit(
(e) => {
  let success = false;
  let name = $('#nom').val()
  let prenom = $('#prenom').val()
  let email = $('#mail').val()
  let adress = $('#add').val()
  let tel = $('#tel').val()
  let cp = $('#postal_code').val()
  let ville = $('#locality').val()
  let company = $('#nomS').val()

  let datetimepicker = $('#datetime').data('DateTimePicker')
  let hours = $('#clock').data('DateTimePicker').date().hours()
  let minutes = $('#clock').data('DateTimePicker').date().minutes()

  if(success)
    socket.emit(
      'sendMail',
      {
        subject : "facturation",
        destination : email,
        datetime : datetime,
        dateApi :  datetimepicker.getMoment().hours(hours).minutes(minutes).format(),
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
    let mess_success = $('#simulate').find('[data-name=send_success]')
    mess_success.show()
    setTimeout(()=>{ $('.formulaire').modal('hide'); mess_success.hide() }, 1000)
  } )

  e.preventDefault()

})
