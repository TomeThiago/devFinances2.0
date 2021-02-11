const express = require('express');
const routes = require('./routes');

require('dotenv').config();

const app = express();

app.disable("x-powered-by");
app.use(express.json());
app.use(routes);
app.use(express.static('public'))

const server = app.listen(process.env.PORT || 3333);

console.log(`Server successfully started on port ${server.address().port}!`);
