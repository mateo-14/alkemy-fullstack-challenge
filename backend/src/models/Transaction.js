const { Model, DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db');

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    desc: DataTypes.STRING,
    data: DataTypes.DATE,
    amount: DataTypes.NUMBER,
    type: DataTypes.SMALLINT,
  },
  { sequelize }
);

module.exports = Transaction;

const Category = require('./Category');
const User = require('./User');
Transaction.belongsTo(User);
Transaction.belongsToMany(Category, { through: 'TransactionsCategories' });
