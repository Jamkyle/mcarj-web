var firebase = require('firebase')

firebase.initializeApp({
  serviceAccount: "./planning-39905f3f5dea.json",
  databaseURL: "https://planning-f45d1.firebaseio.com"
});

exports.ref = function(path){
  return firebase.database().ref(path);
}
