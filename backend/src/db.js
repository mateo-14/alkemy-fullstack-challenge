const { Sequelize } = require('sequelize');
const db = process.env.NODE_ENV === 'test' ? ':memory:' : './db.sqlite';

const sequelize = new Sequelize(`sqlite:${db}`, {
  logging: process.env.NODE_ENV === 'test' ? false : console.log,
});

module.exports = sequelize;
