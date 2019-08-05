const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => res.send({token: 123, auth: 1234}));
app.get('/pay', (req, res)=> res.send("pay REST"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));