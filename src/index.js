import Gsap from 'gsap'
import ScrollMagic from 'scrollmagic'
import 'imports?define=>false!ScrollMagicGSAP'
import 'jquery'
import { googlefonts } from 'googlefonts'

import _ from 'lodash'

import 'font-awesome/css/font-awesome.min.css'

import 'moment'
// import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'

import './lib/main.styl'

Stripe.setPublishableKey('pk_test_DD5S71d8Y0UIIsExbpR0Kfvf');

import { socket } from './lib/js/connect'

import './lib/js/form'
import './lib/js/slider'

import GoogleMapsLoader from 'google-maps'

GoogleMapsLoader.KEY = 'AIzaSyCOJ80rJqGMgIpUCnB8VAygYTVOQDIHyMY'
GoogleMapsLoader.LIBRARIES = ['geometry', 'places']
GoogleMapsLoader.LANGUAGE = 'fr'
GoogleMapsLoader.REGION = 'FR'

let app = $('#app')
let script = document.querySelector('#script')

var controller = new ScrollMagic.Controller({
  globalSceneOptions: { triggerHook: "onEnter", duration: "200%" }
});

// var way = new ScrollMagic.Controller({
//   globalSceneOptions: { triggerHook: 'onEnter', duration: '100%' }
// });

let head = new ScrollMagic.Scene({ triggerElement: "#header" })
.setTween("#header > *", {y:"23%", ease: Linear.easeNone})
.addTo(controller);

new ScrollMagic.Scene({ offset: head.scrollOffset()+600 })
.setTween(TweenLite.to(".inner", 1, { opacity:'0', ease: Linear.easeNone }))
// .addIndicators()
.addTo(controller);

// new ScrollMagic.Scene({ triggerElement : '#way' })
// .setTween("#way", { y: '50%',  ease: Linear.easeInOut})
// .addTo(way)

let panel = new ScrollMagic.Scene({triggerElement: ".panel", reverse:false})
.on('enter', () => { TweenMax.from(".panel", 1, {left: 500, ease: Back.easeOut}); }
).addTo(controller)


var date = moment(), minDate, disabledDates

// dateTime Bootstrap
let datetime = $('#datetime')
let clock  = $('#clock')



if(moment().hours() < 6 )
{
  ( moment().day() === 6 || moment().date() === 13 && moment().month() === 6 )?
    date = moment().add(1, 'days').hours(6)
  : date = moment().hours(6)
  disabledDates = [ moment().subtract(1, 'days'), '07-14-2016' ]
}
else if(moment().hours() >= 20)
{
  ( moment().day() === 6 || moment().date() === 13 && moment().month() === 6 )?
  date = moment().add(2, 'days').hours(6)
  : date = moment().add(1, 'days').hours(6)
  disabledDates = [ moment().subtract(1, 'days'), moment(), '07-14-2016' ]
}
else
{
  (moment().minutes() < 30)?
  date = moment().add(1, 'hours') : date = moment().add(2, 'hours')
  minDate = moment().add(30, 'minutes')
  disabledDates = [ moment().subtract(1, 'days'), '07-14-2016' ]
}
var nbPlaces = 4


socket.on('sits', function(a){
  var sits = $('#sits')
  nbPlaces = 4 - a
  sits.empty()
  if(nbPlaces > 0){
    for(let i=1; i<=nbPlaces; i++)
    {
      let options = $('<option value="'+i+'">'+i+'</option>');
      sits.append(options)
    }
  }
  else sits.append($('<option value="0"> aucune place disponible </option>'))
})

datetime.datetimepicker({
  date : date,
  minDate: moment().hours(0).minutes(-1),
  maxDate: moment().add(1, 'years').month(11),
  disabledDates: disabledDates,
  daysOfWeekDisabled: [0],
  format : 'DD/MM/YYYY'
});

clock.datetimepicker({
  date : date,
  minDate : minDate,
  maxDate : moment().hours(20).minutes(0),
  disabledHours : [ 0 ,1 ,2 ,3 ,4, 5, 21, 22, 23 ],
  stepping : 60,
  format : 'HH:mm'
});
var hours = clock.data('DateTimePicker').date().hours()

if(moment().day() === 0 || (moment().date() === 14 && moment().month() === 6)){
  let demain = moment().add(1, 'days')
  datetime.data('DateTimePicker').date(demain)
  clock.data('DateTimePicker').minDate(false)
  clock.data('DateTimePicker').date(moment().hours(6))
  }
socket.emit('date_selected', datetime.data('DateTimePicker').date().hours(hours).format('YYYY/MM/DD/H') )

datetime.on('dp.change', (e)=>{
  let hours = clock.data('DateTimePicker').date().hours()
  console.log(e.date.hours(hours).format('YYYY/MM/DD/H'));
  socket.emit('date_selected', e.date.hours(hours).format('YYYY/MM/DD/H') )

  if(e.date > moment())
    clock.data('DateTimePicker').minDate(false)
  else {
    clock.data('DateTimePicker').minDate(minDate)
    clock.data('DateTimePicker').date(moment().add(1, "hours"))
  }
})

clock.on('dp.change', (e)=>{
  let aDate = datetime.data('DateTimePicker').date()
  socket.emit('date_selected', aDate.hours(e.date.hours()).format('YYYY/MM/DD/H') )
})

//nb places


//bagages
let currentBagage = 1
let totalBagages = 4 - currentBagage
let renderBagage;

(totalBagages > 0)? renderBagage = 1 : renderBagage = 0;

for(let i=0; i<=renderBagage; i++)
{
  let selected
  if(i==1)
  selected = 'selected'
  let option = $('<option value="'+i+'"'+selected+' >'+i+'</option>');

  $('#packs').append(option)
}

$('.dismiss-alert-danger').click((e)=>{
  $('.alert-danger').hide()
  e.preventDefault()
})



$('#openGeneralCondition').click((event)=>{
  event.preventDefault()
  window.open('cgu.html', 'conditions', 'fullscreen=yes')
})

GoogleMapsLoader.load(google => {

  let myOptions = {
    autocomplete : {
      componentRestrictions : {country : "fr"},
      types: ['geocode']
    }
  }
  var autocomplete, placeSearch

  var componentForm = {
    locality : 'short_name',
    postal_code : 'short_name'
  };

  $('#add').on('focus', initAutocomplete);

  function initAutocomplete(){

    // Create the autocomplete object, restricting the search to geographical
    // location types.
    var val = $('#add')
    autocomplete = new google.maps.places.Autocomplete(val[0], myOptions.autocomplete);

    autocomplete.addListener('place_changed', fillInAddress);
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
  }

  // [START region_fillform]
  function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    var address = $('#add').val().split(',')
    for (var component in componentForm) {
      $('#'+component)[0].value = '';
      $('#'+component)[0].disabled = false;
    }
    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        $('#'+addressType)[0].value = val
      }
    }
    $('#add')[0].value = _.head(address);
  }
  // [END region_fillform]

  // [START region_geolocation]
  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
  }

});
