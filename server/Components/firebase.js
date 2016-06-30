var firebase = require('firebase')

firebase.initializeApp({
  serviceAccount: "./planning-b1a844082b66.json",
  databaseURL: "https://planning-f45d1.firebaseio.com"
});

exports.ref = function(path){
  return firebase.database().ref(path);
}
