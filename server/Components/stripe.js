var stripe = require('stripe')('sk_test_NkV0pMUIqCixCWHxOiHmXRli');
// var stripe = require('stripe')('sk_live_idwgvCsgWfL66yJMjDcfG0qH');
var sendMail = require('./sendEmail.js');
var planning = require('./planning.js');
var server = require('../server.js');

module.exports = (data) => {
console.log('======== prise en charge du paiement =======');
var charge = stripe.charges.create({
  amount: 1250, // amount in cents, again
  currency: "eur",
  source: data.token,
  description: data.destination+" - paiement Denfert-Orly"
}, function(err, charge) {
  if (err && err.type === 'StripeCardError') {
    // The card has been declined
    console.log('card has been declined');
    server.socket.emit('error_card');
  }else {
    console.log('good reussi');
    // sendMail.sendMail(data, null, id)
    planning(data);

  }
});

}
