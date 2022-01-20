'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.belongsToMany(models.Transaction, {
        through: 'transactions_categories',
        onDelete: 'CASCADE',
        foreignKey: 'categoryId',
      });
    }
  }
  Category.init(
    {
      name: { type: DataTypes.STRING, unique: true },
    },
    {
      sequelize,
      name: { singular: 'category', plural: 'categories' },
    },
  );
  return Category;
};
