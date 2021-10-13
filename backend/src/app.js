const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const transactionsRoutes = require('./routes/transactions.routes');

//Middlewares
app.use(express.json());

//Routes
app.use('/auth', authRoutes);
app.use('/transactions', transactionsRoutes);

module.exports = app;
