import GoogleMapsLoader from 'google-maps'
import $ from 'jquery'

GoogleMapsLoader.KEY = 'AIzaSyCOJ80rJqGMgIpUCnB8VAygYTVOQDIHyMY'
GoogleMapsLoader.LIBRARIES = ['geometry', 'places']
GoogleMapsLoader.LANGUAGE = 'fr'
GoogleMapsLoader.REGION = 'FR'


let map, direction,
autocomplete,
distance,
origin,
destination,
hours,
minutes,
date,
duration,
directionsService

GoogleMapsLoader.load(google => {

directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire

  let latLng = new google.maps.LatLng(48.8566140, 2.3522219); // Coordonnée de Paris
    let myOptions = {
      maps : {
        zoom      : 15,
        center    : latLng,
        mapTypeId : google.maps.MapTypeId.ROADMAP, // Type de carte, différentes valeurs possible HYBRID, ROADMAP, SATELLITE, TERRAIN
        maxZoom   : 20
      },
      autocomplete : {
        componentRestrictions : {country : "fr"}
      }
    }

    // map      = new google.maps.Map(document.getElementById('map'), myOptions.maps);
    direction = new google.maps.DirectionsRenderer({
      map   : map
    });

    $.each($('input'), function(e, val){
      if($(this).hasClass('autocomplete'))
    autocomplete = new google.maps.places.Autocomplete(val, myOptions.autocomplete);})

})

const calculer =  () => {
    $('#simulator').css({'display':'block'});
    origin = document.getElementById("origin").value;
    destination = document.getElementById("destination").value;
    // console.log("2 "+origin+" - "+ destination);

  let request = {
    origin      : origin,
    destination : destination,
    travelMode  : google.maps.DirectionsTravelMode.DRIVING // Type de transport
  }

  if(request.origin && request.destination){
    directionsService.route(request, (response, status) => { // Envoie de la requête pour calculer le parcours
      if(status == google.maps.DirectionsStatus.OK){
        direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
        distance = (response.routes[0].legs[0].distance.value)/1000; //récupère la distance du parcourt
        duration = Math.ceil((response.routes[0].legs[0].duration.value)/60);
        if(request.origin.match(/Paris/i) && request.destination.match(/Paris-Orly/i))
        $("#price").text("35 €")
        else if(request.origin.match(/Paris/i) && request.destination.match(/Aéroport/i))
        $("#price").text("47 €")
        else if(request.origin.match(/Paris/i) && request.destination.match(/Paris/i))
        $("#price").text("20 € ")
        else if(distance>20){
          (distance>50)?
          $("#price").text(Math.ceil(Math.ceil(distance)*1.2) + " € ")
          :$("#price").text(Math.ceil(Math.ceil(distance)*(1+distance/100))+" € ");
        }
        else
          $("#price").text(Math.ceil(Math.ceil(distance)*2.2)+" € ");
        $('#distance').text(Math.round(distance)+' km');

        (duration>59)?
          createRwTb('Durée', Math.floor(duration/60)+' h '+ duration%60 +' min')
        : createRwTb('Durée', duration+" min")

        //   $('#duree').text(Math.floor(duration/60)+' h '+ duration%60 +' min')
        // :$('#duree').text(duration+" min");
        }
      else{
          alert("Désolé nous n'avons pas trouvé d'itinéraire. Veuillez entrer une adresse ou un lieu exacte")
      }
      // createRwTb('Date', datetime.find('input').val());
      // createRwTb('Heure', clock.find('input').val());

    });
      // map      = new google.maps.Map(document.getElementById('map'));
      direction = new google.maps.DirectionsRenderer({
        map   : map
      })
  }
};

$( "#formMap" ).submit(function( event ) {
  calculer()
  event.preventDefault();
});

function createRwTb(id, value){

  var aId = standardize(id)
  var parent = document.getElementById('results')
  var child = document.getElementById(aId)
  console.log(child)
  if(child == null)
    {
      var row = document.createElement('tr');
      parent.appendChild(row);
      var col = document.createElement('td');
      col.innerHTML=id;
      var e = document.createElement('td');
      e.setAttribute('id', aId);
      row.appendChild(col);
      row.appendChild(e);
    }
  console.log(value);
  $('#'+aId).text(value);

};

function standardize(id){ // transform caracter spec to standard
  var str = id.toLowerCase();
  var cSpecial = [
        /[\340-\346]/g, // a
        /[\350-\353]/g, // e
        /[\354-\357]/g, // i
        /[\362-\370]/g, // o
        /[\371-\374]/g, // u
        /[\361]/g, // n
        /[\347]/g, // c
    ];
    var normalize = ['a','e','i','o','u','n','c'];
    for(var i = 0; i < cSpecial.length; i++){
        str = str.replace(cSpecial[i], normalize[i]);
    }
  return str;
};
