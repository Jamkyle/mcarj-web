import { socket } from './connect'

var datetime
var clock
var sits
var packs
var success = false
var hourMin

// consultation
$('a.close').click(e =>{
  let current = e.target.dataset.target
  $('body').find('[data-name='+current+']').hide()
  e.preventDefault()
})

$('#simulate').submit(
  (e)=>{

    sits = $('#sits').val();
    //recupération des valeurs de dateTime
    datetime = $('#datetime').data('date')
    clock  = $('#clock').data('date')
    var datetimepicker = $('#datetime').data('DateTimePicker')
    var clockpicker;
    ((moment().minutes() < 30 && moment().hours() < 20) || moment().hours() < 5)?
      clockpicker = $('#clock').data('DateTimePicker').date()
    : clockpicker = $('#clock').data('DateTimePicker').date().subtract(30, 'minutes')
    // let day = datetimepicker.date().date()
    // let month = datetimepicker.date().month()
    // let year = $('#datetime').data('DateTimePicker').date().year()
    let hours = clockpicker.hours()
    let minutes = clockpicker.minutes()
    // if(moment() < moment(datetime).hours(clock))
    // moment().date(day).month(month).year(year).hours(hours).minutes(minutes)
    if( moment() < datetimepicker.getMoment(datetime).hours(hours).minutes(minutes)
    && datetimepicker.getMoment(datetime).isValid()
    && hours >= 6
    && hours < 20 // condition si la date est dans le cadre horraire
    && sits > 0
   )
  {
    packs  = $('#packs').val()
    // show le formulaire
    $('.formulaire').modal('show')
    $('#date_depart').text(datetime+' à '+clock)
    $('#price').text(sits*12.5+' €')
    $('#nbsits').text(sits)
    $('#bagage').text(packs*sits)
    $('#simulate').find('[data-name=datetime]').hide()
    e.preventDefault()
  }
  else
  {
    console.log(datetimepicker.getMoment(datetime).hours(hours).minutes(minutes));
    $('#simulate').find('[data-name=datetime]').show()
    e.preventDefault()

  }
}
)
// apres le focus du champs telephone check le num tel
$('#tel').on('change', (e)=>{
  // console.log(/^(0|\+33)( ?)[1-9]([-. ]?[0-9]{2}){4}$/.test(e.target.value));
  if( /^(0|\+33)( ?)[1-9]([-. ]?[0-9]{2}){4}$/.test(e.target.value) ){
    e.target.value = e.target.value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
    e.target.value = e.target.value.replace(/^0/g, "+33 ")
    $('#simulate').find('[data-name=tel]').hide()
    $('#tel').parent().removeClass('has-error')
    $('#tel').parent().addClass('has-success')
    success = true
  }
  else {
    $('#tel').parent().addClass('has-error')
    $('#simulate').find('[data-name=tel]').show()
  }
})

var form = $('#formReservation');
//au submit du formulaire de réservation
form.submit(
  (e) => {
    var clockpicker;
    (moment().minutes() < 30 || moment().hours() < 5)?
      clockpicker = $('#clock').data('DateTimePicker').date()
    : clockpicker = $('#clock').data('DateTimePicker').date().subtract(30, 'minutes')

    let name = $('#nom').val()
    let prenom = $('#prenom').val()
    let email = $('#mail').val()
    let adress = $('#add').val()
    let tel = $('#tel').val()
    let cp = $('#postal_code').val()
    let ville = $('#locality').val()
    let company = $('#nomS').val()
    let hours = $('#clock').data('DateTimePicker').date().hours()
    let minutes = clockpicker.minutes()
    let datetimepicker = $('#datetime').data('DateTimePicker')

    //teste si la date est valide
    if( moment() < datetimepicker.getMoment(datetime).hours(clockpicker.hours()).minutes(minutes)
    && datetimepicker.getMoment(datetime).isValid()
    && hours >= 6 && hours <20 && sits != 0){
      form.find('.submit').prop('disabled', true);
      Stripe.card.createToken(e.currentTarget, stripeResponseHandler)

      function stripeResponseHandler(status, res){
        if (res.error) { // Problem!

          // Show the errors on the form:
          form.find('.payment-errors').text(res.error.message);
          form.find('.submit').prop('disabled', false); // Re-enable submission

        } else { // Token was created!

          // Get the token ID:
          var token = res.id;
          // Submit the form:
          if(success)
          socket.emit(
            'sendMail',
            {
              subject : "Bon de commande",
              destination : email,
              datetime : datetime,
              creneau : datetimepicker.getMoment(datetime).hours(hours).minutes(minutes).format('YYYY/MM/DD/H'),
              dateApi :  datetimepicker.getMoment(datetime).hours(hours).minutes(minutes).format(),
              hours : clock,
              name: name,
              fname : prenom,
              address : adress,
              CP : { num: cp, ville: ville },
              company : company,
              sits : sits,
              packs : packs,
              token : token
            }
          );
        }
      }
      e.preventDefault()
    }else {
      let div = $('<div></div>').addClass('alert alert-danger fade in').text('Attention! Vérifiez que la date soit valide')
      form.append(div)
    }

    })

    socket.on('send_success', (message) => {
      let mess_success = $('#simulate').find('[data-name=send_success]')
      mess_success.show()
      mess_success.text('Un mail vous a été envoyé!')

      setTimeout(()=>{ $('.formulaire').modal('hide');
       mess_success.hide();
       form.find('.submit').prop('disabled', false);
       window.location.href = '/';
       form[0].reset()
     }, 1000)
    } )
