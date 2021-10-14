const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
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
  create: async (req, res) => {
    const { desc, type, amount, date, categories } = req.body;

    const validatorErrors = {};
    if (!desc) validatorErrors.desc = 'Description is required';
    if (!type) validatorErrors.type = 'Type is required';
    if (!amount) validatorErrors.amount = 'Date is required';

    if (Object.keys(validatorErrors).length > 0) return res.status(400).json({ errors: validatorErrors });
    const newTransaction = {
      desc,
      amount,
      type: Math.min(type, 1),
      date: new Date(date) || Date.now(),
    };

    try {
      const user = await User.findOne({ where: { id: req.userID } });
      if (!user) return res.sendStatus(401);

      const transaction = await Transaction.create(newTransaction);
      await user.addTransaction(transaction);

      if (categories instanceof Array && categories.length > 0) {
        let dbCategories = await Promise.all(
          categories.map((category) => Category.findOrCreate({ where: { name: category } }))
        );
        dbCategories = dbCategories.map(([category]) => category);
        await transaction.addCategories(dbCategories);
        transaction.categories = dbCategories;
      }
      res.json(transaction);
    } catch (err) {
      console.error(err);
    }
  },
  update: async (req, res) => {
    res.sendStatus(200);
  },
  delete: async (req, res) => {
    res.sendStatus(200);
  },
};
