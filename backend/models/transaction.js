'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsToMany(models.Category, {
        through: 'transactions_categories',
        onDelete: 'CASCADE',
        foreignKey: 'transactionId'
      });
      Transaction.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }
  Transaction.init(
    {
      desc: DataTypes.STRING,
      date: DataTypes.DATE,
      amount: DataTypes.NUMBER,
      type: DataTypes.SMALLINT,
    },
    {
      sequelize,
      name: { singular: 'transaction', plural: 'transactions' },
    },
  );
  return Transaction;
};
