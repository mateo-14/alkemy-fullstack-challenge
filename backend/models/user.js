'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Transaction, { foreignKey: 'userId', onDelete: 'CASCADE'});
    }

    verifyPassword(password) {
      return bcrypt.compare(password, this.password);
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  function hashPassword(user) {
    if (user.changed('password')) {
      return bcrypt
        .hash(user.password, 10)
        .then((hash) => {
          user.password = hash;
        })
        .catch((err) => console.error(err));
    }
  }

  User.beforeCreate(hashPassword);
  User.beforeUpdate(hashPassword);
  return User;
};
