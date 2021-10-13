const { Model, DataTypes, Transaction } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  verifyPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

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

User.hasMany(Transaction);
module.exports = User;
