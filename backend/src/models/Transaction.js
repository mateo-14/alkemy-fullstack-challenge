const { Model, DataTypes } = require('sequelize');

class Transaction extends Model {}

Transaction.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  desc: DataTypes.STRING,
  data: DataTypes.DATE,
  amount: DataTypes.NUMBER,
  type: DataTypes.SMALLINT,
  category: DataTypes.STRING,
});

module.exports = Transaction;
