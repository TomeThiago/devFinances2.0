const express = require('express');

const FinancesController = require('./controllers/FinancesController');

const routes = express.Router();

routes.get('/transactions', FinancesController.index);
routes.post('/transactions', FinancesController.store);
routes.delete('/transactions/:id', FinancesController.delete);

module.exports = routes;
