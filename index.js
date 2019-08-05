const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// body-parser configuration
// FIXME: warning: body-parser deprecated undefined extended: provide extended option app.js:5:20
app.use(cors())
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// When deploy change port to 8080
//const port = 8080;

const Payment = require('./pay');
const payment = new Payment();

let userData = {
    "amount": "5000.00",
    "currency": "USD",
    "card": {
      "nameOnCard": "Christopher",
      "cardNumber": "4242424242424242",
      "expirationMonth": "03",
      "expirationYear": "2020",
      "securityCode": "123",
      "billingAddress": {
        "street1": "41 Grandview St Unit C",
        "city": "Santa Cruz",
        "state": "CA",
        "postalCode": "95060",
        "country": "USA"
      }
    },
    "payer": {
      "name": "Christina C",
      "email": "cchen+test@paystand.com",
      "address": {
        "street1": "41 Grandview St Unit C",
        "city": "Santa Cruz",
        "state": "CA",
        "postalCode": "95060",
        "country": "USA"
      }
    }
  };

app.get('/', (req, res) => res.send({token: 123, auth: 1234}));

app.post('/pay', (req, res)=> {
    console.log("req:");
    console.log(req.body);
    payment.setUserData(req.body);

    payment.pay().then(result => {
        res.json({ result });
    });
});

app.listen(process.env.PORT || 8080);