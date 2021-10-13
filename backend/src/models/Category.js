const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Category extends Model {}

Category.init(
  {
    name: DataTypes.STRING,
  },
  { sequelize }
);

module.exports = Category;

const Transaction = require('./Transaction');
Category.belongsToMany(Transaction, { through: 'TransactionsCategories' });
