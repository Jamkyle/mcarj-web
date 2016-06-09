import Gsap from 'gsap'
import ScrollMagic from 'scrollmagic'
import 'imports?define=>false!ScrollMagicGSAP'
import 'jquery'
import { googlefonts } from 'googlefonts'
import './lib/main.styl'
import './lib/js/map'
import 'font-awesome/css/font-awesome.min.css'

import 'moment'
// import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
import 'imports?define=>false!eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js'

import './lib/js/connect'
import './lib/js/form'



let app = document.querySelector('#app')
let script = document.querySelector('#script')

var controller = new ScrollMagic.Controller({
   globalSceneOptions: { triggerHook: "onEnter", duration: "200%" }
 });

let head = new ScrollMagic.Scene({ triggerElement: "#header" })
.setTween("#header > *", {y:"23%", ease: Linear.easeNone})
.addTo(controller);

new ScrollMagic.Scene({ offset: head.scrollOffset()+600 })
.setTween(TweenLite.to(".inner", 1, {opacity:'0', ease: Linear.easeNone}))
// .addIndicators()
.addTo(controller);

let panel = new ScrollMagic.Scene({triggerElement: ".panel", reverse:false})
                    .on('enter', () => {TweenMax.from(".panel", 1, {left: 500, ease: Back.easeOut});}
                    ).addTo(controller)
let date = moment() , hours, minutes

let datetime = $('#datetime')
let clock  = $('#clock')

datetime.datetimepicker({
  minDate: moment().hours(-1),
  disabledDates:[ moment().subtract(1, 'days') ],
  maxDate: moment().add(1, 'years').month(12),
  daysOfWeekDisabled: [0],
  format : 'DD/MM/YYYY'
});

clock.datetimepicker({
  date : date || moment().add(1, 'hours'),
  minDate: moment(),
  maxDate : date.add(1, 'days'),
  stepping : 30,
  format : 'LT'
});

datetime.on('dp.change', function(e){
  date = moment(e.date)
})

//

//nb places
let nbPlaces = 4

for(let i=1; i<=nbPlaces; i++)
{
  let option = $('<option value="'+i+'">'+i+'</option>');
  $('#tickets').append(option)
}
//bagages
let currentBagage = 1
let totalBagages = 4 - currentBagage
let renderBagage;

(totalBagages > 0)? renderBagage = 1 : renderBagage = 0;

for(let i=0; i<=renderBagage; i++)
{
  let option = $('<option value="'+i+'">'+i+'</option>');
  $('#packages').append(option)
}

$('#slider').carousel({
  interval : 5000
})
$(".slider1").click(function(){
  $("#slider").carousel(0);
});
$(".slider2").click(function(){
  $("#slider").carousel(1);
});
// Enable Carousel Controls
$(".left").click(function(){
  $("#slider").carousel("prev");
});

$('#openGeneralCondition').click((event)=>{
  event.preventDefault()
  $('#generalCondition').modal('toggle')
})
