import { socket } from './connect'


var datetime
var clock
var sits
var packs
var success = false
var hourMin
var validAll
var validMail


// consultation
$('a.close').click(e =>{
  let current = e.target.dataset.target
  $('body').find('[data-name='+current+']').hide()

  e.preventDefault()
})

$('input.cc-num').payment('formatCardNumber');

$('input.cc-num').on('focusout', ()=>{
  let valid = $.payment.validateCardNumber($('input.cc-num').val());

  if (!valid) {
    $('#formReservation').find('.payment-err-card').text('Le numéro de la carte est invalide');
    $('input.cc-num').parent().addClass('has-error');
  }
  else {
    $('input.cc-num').parent().removeClass('has-error');
    $('input.cc-num').parent().addClass('has-success');
    $('#formReservation').find('.payment-err-card').text('');

  }
})

$('input#Confmail').on('focusout', function(){
  validMail = $(this).val() === $('#mail').val()
  if(validMail)
  {
     $(this).parent().removeClass('has-error')
    $("#mail").parent().removeClass('has-error')
     $(this).parent().addClass('has-success')
    $("#mail").parent().addClass('has-success')
    $('#formReservation').find('[data-name=message-mail]').css('color','green').text('Succès! les deux champs correspondent');
  }
  else {
    $(this).parent().removeClass('has-success')
   $("#mail").parent().removeClass('has-success')
    $(this).parent().addClass('has-error')
    $("#mail").parent().addClass('has-error')
    $('#formReservation').find('[data-name=message-mail]').css('color','red').text('Erreur! les deux champs ne correspondent pas. Veuillez vérifier la saisi des informations.');

  }
})


$('#simulate').submit(
  (e)=>{
    var datetimepicker = $('#datetime').data('DateTimePicker')

    sits = $('#sits').val();
    //recupération des valeurs de dateTime
    datetime = $('#datetime').data('date')

    clock  = $('#clock').data('date')
    var clockpicker;
    console.log(moment().date() == datetime.split('/')[0]);
    ((moment().date() == datetime.split('/')[0] && moment().minutes() > 40) && !(moment().hours() > 20 || moment().hours() < 6)  )?
    clockpicker = $('#clock').data('DateTimePicker').date().subtract(30, 'minutes')
    : clockpicker = $('#clock').data('DateTimePicker').date()
    // let day = datetimepicker.date().date()
    // let month = datetimepicker.date().month()
    // let year = $('#datetime').data('DateTimePicker').date().year()
    let hours = clockpicker.hours()
    let minutes = clockpicker.minutes()

    console.log('h:'+hours+' m:'+minutes);

    // if(moment() < moment(datetime).hours(clock))
    // moment().date(day).month(month).year(year).hours(hours).minutes(minutes)
    if( moment() < datetimepicker.getMoment(datetime).hours(hours).minutes(minutes)
    && datetimepicker.getMoment(datetime).isValid()
    && hours >= 6
    && hours <= 20 // condition si la date est dans le cadre horraire
    && sits > 0
  )
  {
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
    //    console.log(datetimepicker.getMoment(datetime).hours(hours).minutes(minutes));
    $('#simulate').find('[data-name=datetime]').show()
    e.preventDefault()

  }
}
)
// apres le focus du champs telephone check le num tel
$('#tel').on('focusout', (e)=>{
  // console.log(/^(0|\+33)( ?)[1-9]([-. ]?[0-9]{2}){4}$/.test(e.target.value));
  if( /^(0|\+33)( ?)[1-9]([-. ]?[0-9]{2}){4}$/.test(e.target.value) ){
    e.target.value = e.target.value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
    e.target.value = e.target.value.replace(/^0/g, "+33 ")
    $('#simulate').find('[data-name=tel]').text('')
    $('#tel').parent().removeClass('has-error')
    $('#tel').parent().addClass('has-success')
    success = true
  }
  else {
    $('#tel').parent().addClass('has-error')
    $('[data-name=tel]').text("Le numéro que vous avez entré n'est pas conforme")

  }
})

var form = $('#formReservation');
$('.modal').on('hidden.bs.modal', ()=>{
  //  console.log('modal close');
  form[0].reset();
  $('[data-name=tel]').text('')
  $('.payment-errors').text('')
  $('.payment-err-card').text('')
  $('[data-name=message-mail]').text('')
  $('.has-error').removeClass('has-error')
  $('.has-success').removeClass('has-success')
  form.find('.submit').prop('disabled', false); // Re-enable submission

});
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
    let address = $('#add').val()
    let tel = $('#tel').val()
    let cp = $('#postal_code').val()
    let ville = $('#locality').val()
    let company = $('#nomS').val()
    let hours = $('#clock').data('DateTimePicker').date().hours()
    let minutes = clockpicker.minutes()
    let datetimepicker = $('#datetime').data('DateTimePicker')
    validAll = validMail
    if (!validAll){

      $('.modal').animate({
                scrollTop: 300
              }, 700);
              return false;
    }
    //teste si la date est toujours valide
    if( moment() < datetimepicker.getMoment(datetime).hours(clockpicker.hours()).minutes(minutes)
    && datetimepicker.getMoment(datetime).isValid()
    && hours >= 6 && hours <=20 && sits != 0
    && validAll){
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
              timestamp : datetimepicker.getMoment(datetime).hours(hours).minutes(minutes).valueOf(),
              creneau : datetimepicker.getMoment(datetime).hours(hours).minutes(minutes).format('YYYY/MM/DD/H'),
              dateApi :  datetimepicker.getMoment(datetime).hours(hours).minutes(minutes).format(),
              hours : clock,
              client: [ name, prenom, tel, address],
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

      let div = $('<div></div>').addClass('alert alert-danger fade in').text('Attention! Vérifiez que la date ou vos données soit valide')
      if(!form.has('div.alert-danger'))
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
    window.location.reload();
    form[0].reset()
  }, 5000)
} )
