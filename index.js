const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => res.send({token: 123, auth: 1234}));
app.get('/pay', (req, res)=> res.send("pay REST"));

app.listen(process.env.PORT  || 8080);