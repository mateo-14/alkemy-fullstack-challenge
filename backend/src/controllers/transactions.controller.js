const Category = require('../models/Category');
const User = require('../models/User');

module.exports = {
  getAll: async (req, res) => {
    const { type, category } = req.query;
    try {
      const user = await User.findOne({ where: { id: req.userID } });
      if (user) {
        const where = {};
        if (type == 0 || type == 1) {
          where.type = type;
        }
        const include = [];
        if (category) {
          include.push({
            model: Category,
            where: { name: category },
            through: {
              attributes: [],
            },
            attributes: ['name'],
          });
        }
        const transactions = await user.getTransactions({ where, include });
        res.json(transactions);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ errors: { error: err.message } });
    }
  },
  create: (req, res) => {
    res.sendStatus(200);
  },
  update: (req, res) => {
    res.sendStatus(200);
  },
  delete: (req, res) => {
    res.sendStatus(200);
  },
};
