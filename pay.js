const requestPromise = require('request-promise-native');


class Payment {
  constructor() {
    this.data = null;
    this.URL_AUTH = 'https://api.paystand.co/v3/oauth/token';
    this.URL_PAYMENTS = 'https://api.paystand.co/v3/payments/secure';
    this.CLIENT_ID = process.env.CLIENT_ID;
  }

  /**
   * set creadict card data 
   * @param {object} data: contain the user billing information 
   */
  setUserData(data) {
    this.data = data;
  }

  /**
   * Private method that returns token object which includes URL, header and body.
   * @param {string} clientId: alphanumeric id 
   * @param {string} clientSecret: alphanumeric id
   * @returns {object} token
   */  
  _createTokenOptions(clientId, clientSecret) {
    return {
      url: this.URL_AUTH,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "auth"
      },
      json: true
    };
  }

   /**
   * Private method that returns token object which includes URL, header and body.
   * @param {string} auth: authentification token  
   * @param {string} xCustomerId: alphanumeric id
   * @param {object} data: user billing data
   * @returns {object} token
   */   
  _createPaymentOptions(auth, xCustomerId, data) {
    return {
      url: this.URL_PAYMENTS,
      headers: {
        Authorization: auth,
        'X-CUSTOMER-ID': xCustomerId,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: data,
      json: true
    };
  }

  /**
   * @returns {object} object with costumer keys
   */ 
  _fetchKeys() {
    return {
      CLIENT_ID,
      client_secret: 'dbc17981950c3ded3aea051110cc05d562659209',
      xCustomerId: 'ody8bd9st5qpq8619vj3j173'
    };
  }

  /**
   * send post method with a user bill data 
   * @returns {Promise} result of POST transaction
   */
  _authenticate() {
    const keys = this._fetchKeys();
    const options = this._createTokenOptions(keys.CLIENT_ID, keys.client_secret);

    return requestPromise.post(options)
      .then(tokenInfo => {
        return tokenInfo.token_type + ' ' + tokenInfo.access_token;
      })
      .catch(err => {
        console.log(err);
        //TODO: handle error
      });
  }

  /**
   * get authentication token and then send payment transaction to Paystand
   * @returns {Promise} result of POST transaction
   */
  pay() {
    const keys = this._fetchKeys();

    return this._authenticate()
      .then(accessToken => {
        const options = this._createPaymentOptions(accessToken, keys.xCustomerId, this.data);
        return requestPromise.post(options);
      })
      .then(response => {
        console.log("Pago efectuado con exito!!");
        return true;
      })
      .catch(err => {
        console.log("Error en transaccion :(");
        return false;
      });
  }
}

//testing

function test(params) {


  const payment1 = new Payment();
  const payment2 = new Payment();

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

  let wrongUserData = {
    "amount": "5000.00",
    "currency": "USD",
    "card": {
      "nameOnCard": "Christopher",
      "cardNumber": "4242424242424240",
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

  console.log("Simulating correct transaction...")
  payment1.setUserData(userData);
  payment1.pay().then(result => console.log(result));


  console.log("Simulating wrong transaction ...");
  payment2.setUserData(wrongUserData);
  payment2.pay().then(result => console.log(result));


}

//test();

module.exports = Payment;