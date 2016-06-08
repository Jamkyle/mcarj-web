import Gsap from 'gsap'
import ScrollMagic from 'scrollmagic'
import 'imports?define=>false!ScrollMagicGSAP'
import 'jquery'
import { googlefonts } from 'googlefonts'
import './lib/main.styl'
import './lib/js/map'
import 'font-awesome/css/font-awesome.min.css'
import io from 'socket.io-client'
import 'moment'
// import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'eonasdan-bootstrap-datetimepicker'

import './quickstart'
import './lib/js/form'
// import 'bootstrap'
let app = document.querySelector('#app')
let script = document.querySelector('#script')

let socket = io.connect('http://localhost:4200');


socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.on('message', function(message) {
        console.log('Le serveur a un message pour vous : ' + message);
    })

var controller = new ScrollMagic.Controller({ globalSceneOptions: { triggerHook: "onEnter", duration: "200%" } });

let head = new ScrollMagic.Scene({triggerElement: "#header"})
        .setTween("#header > *", {y:"23%", ease: Linear.easeNone})
        .addTo(controller);

new ScrollMagic.Scene({offset: head.scrollOffset()+600 })
        .setTween(TweenLite.to(".inner", 1, {opacity:'0', ease: Linear.easeNone}))
        // .addIndicators()
        .addTo(controller);

let panel = new ScrollMagic.Scene({triggerElement: ".panel", reverse:false})
              .on('enter', () => {TweenMax.from(".panel", 1, {left: 500, ease: Back.easeOut});}
            ).addTo(controller)
let date, hours, minutes

date = new Date();
hours = date.getHours()
minutes = date.getMinutes();
if(minutes < 30){
  date.setMinutes(minutes+30);
  }
else{
  date.setHours(hours+1);
}

  let datetime = $('#datetime')
  let clock  = $('#clock')

  datetime.datetimepicker({
    minDate: date,
    widgetPositioning: {vertical : 'auto', horizontal: 'right'},
    daysOfWeekDisabled: [0],
    format: 'DD/MM/YYYY'
  });

  clock.datetimepicker({
    date : moment(date),
    format: 'HH:mm',
    stepping: 15,
  });


  //nb places
  let nbPlaces = 4

  for(let i=1; i<=nbPlaces; i++)
    {
      let option = $('<option value="'+i+'">'+i+'</option>');
      $('#tickets').append(option)
    }
  //bagages
  let bagages = 1
    for(let i=0; i<=bagages; i++)
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

$('#simulate').submit(()=>{
  event.preventDefault()
  $('.formulaire').modal('toggle')
})

$('#openGeneralCondition').click((event)=>{
  event.preventDefault()
  $('#generalCondition').modal('toggle')
})

$('#formReservation').submit((e)=>{
  let name = $('#nom').val()
  console.log("email envoyé");

  socket.emit('sendMail', {
     content: '<h1>Bonjour monsieur '+ name +'</h1><p>nous voici un peu dans l embaras</p>'
   });
})
