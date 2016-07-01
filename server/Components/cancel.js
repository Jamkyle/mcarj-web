
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var http = require('http');
var fs = require('fs');
var pdf =require('pdfkit');
var _ = require('lodash');
var sendEmail = require('./sendEmail.js');
var config = require('../config.js');
var planning = require('./planning.js');

var db = require('./firebase.js').ref('/')

module.exports = function(creneau, course, res) {


  // If modifying these scopes, delete youra previously saved credentials
  // at ~/.credentials/calendar-nodejs-quickstart.json
  var SCOPES = ['https://www.googleapis.com/auth/calendar'];
  var TOKEN_DIR = './.credentials/';
  var TOKEN_PATH = TOKEN_DIR + 'planning.json';

  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Google Calendar API.
    authorize(JSON.parse(content), cancelEvent);
  });

  /**
  * Create an OAuth2 client with the given credentials, and then execute the
  * given callback function.
  *
  * @param {Object} credentials The authorization client credentials.
  * @param {function} callback The callback to call with the authorized client.
  */
  function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
      if (err) {
        getNewToken(oauth2Client, callback);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client);
      }
    });
  }

  /**
  * Get and store new token after prompting for user authorization, and then
  * execute the given callback with the authorized OAuth2 client.
  *
  * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
  * @param {getEventsCallback} callback The callback to call with the authorized
  *     client.
  */
  function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
      rl.close();
      oauth2Client.getToken(code, function (err, token) {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          return;
        }
        oauth2Client.credentials = token;
        storeToken(token);
        callback(oauth2Client);
      });
    });
  }

  /**
  * Store token to disk be used in later program executions.
  *
  * @param {Object} token The token to store to disk.
  */
  function storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
  }

  /**
  * add events on the user's primary calendar.
  *
  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
  */
  function cancelEvent(auth) {
    var ref = db.child(creneau+'/users');

    var calendar = google.calendar('v3');

    calendar.events.delete({
      auth : auth,
      calendarId : 'primary',
      eventId : course,
      sendNotifications: true
    },function (err, event) {
      if (err) {

        console.log('There was an error contacting the Calendar service: ' + err);
        // res.write('votre demande d\'annulation a déjà été prise en compte ou n\'existe plus');
        res.writeHead(302, {'Location': 'http://localhost:3000'})
        res.end()

        return;
      }
      console.log('Event remove');
      res.writeHead(302, {'Location': 'http://localhost:3000'})

      var date = new Date()
      console.log(date.toString());
      ref.orderByChild('course').equalTo(course).once("child_added", function(snap){
        var Post = ref.child(snap.key);
        Post.update({
          status : "cancelled",
          dateCancel : date.toString()
        })
      })



      // calendar.events.update({
      //     auth: auth,
      //     calendarId: 'primary',
      //     eventId : course,
      //     status : 'cancelled',
      //     sendNotifications: true
      // });
    })
  }

}
