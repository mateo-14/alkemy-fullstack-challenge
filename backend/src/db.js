const { Sequelize } = require('sequelize');
const db = process.env.NODE_ENV === 'test' ? ':memory:' : './db.sqlite';

const sequelize = new Sequelize(`sqlite:${db}`);

module.exports = sequelize;
