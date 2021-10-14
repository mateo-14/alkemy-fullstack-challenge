const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Category extends Model {}

Category.init(
  {
    name: { type: DataTypes.STRING, unique: true, primaryKey: true },
  },
  { sequelize, name: { singular: 'category', plural: 'categories' } }
);

module.exports = Category;

const Transaction = require('./Transaction');
Category.belongsToMany(Transaction, { through: 'transaction_category', foreignKey: 'categoryName' });
