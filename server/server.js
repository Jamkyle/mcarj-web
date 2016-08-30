var express = require('express')
var http = require('http')
var sendEmail = require('./Components/sendEmail.js')
var planning = require('./Components/planning.js')
var generatePdf = require('./Components/generatePdf.js')
var stripe = require('./Components/stripe.js')
var cancel = require('./Components/cancel.js')
var url = require('url')
var _ = require('lodash')

var db = require('./Components/firebase.js').ref('/')

var app = new express()
var server = new http.Server(app)
var io = require('socket.io')(server)

var port = require('./config.js').port
var address = require('./config.js').address


app.use('/cancel/:course', function(req, res){
  console.log(course);
    var query = url.parse(req.url).query.split('&');
    var course = query[0].split('=')[1];
    var date = query[1].split('=')[1];

    console.log('course : %s, date : %s', course, date);
    cancel(date, course, res)
})

server.listen(port, function(){
  console.log('server is running... on '+server.address().address+':' + port);
});

function generateId(name, fname){
  var randName = name.split()
  var randFname = fname.split()
  var randInt = Math.floor(Math.random()*(9999 - 1928) + 1928)
  return randFname+randInt+randName
}

var sendBack = function( sits, socket ){
  socket.emit('sits', sits)
}

var count = function (users, socket){
  var sits = null;
  users.on('value', function(childs){
      if(childs.val()!=null)
      {
        var obj = Object(childs.val())
        for ( var key in obj ) {
          if (typeof obj[key].status === 'undefined') {
            tmp = parseInt(obj[key].sits)
            sits += tmp
          }
        }
      }else sits = 0
    sendBack( sits , socket )
  })

}

io.on('connection', function (socket) {
  socket.emit('connect', 'vous êtes bien connecté')
  socket.on('date_selected', function (date){
    var users = db.child(date+'/users');
    var sits = count(users, socket);

  })
   // "ada"
      // var users = childKey.val()


  // socket.on('sendMail', function (data) {
  //   generatePdf(data)
  //   planning(data)
  //
  // });
  socket.on('sendMail', function (data) {
    // var id = generateId(data.name, data.fname)
    stripe(data)
    // recompte à la reservation d'un membre
    var users = db.child(data.creneau+'/users')
    var sits = count(users, socket)
    // generatePdf(data)
    // planning(data)
  });

});
exports.socket = io;
