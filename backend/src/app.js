const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const transactionsRoutes = require('./routes/transactions.routes');
const cors = require('cors');

//Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.use('/auth', authRoutes);
app.use('/transactions', transactionsRoutes);

module.exports = app;
