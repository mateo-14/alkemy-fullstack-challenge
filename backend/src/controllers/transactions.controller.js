const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

module.exports = {
  getAll: async (req, res) => {
    const { type, category, offset } = req.query;
    try {
      const user = await User.findOne({ where: { id: req.userID } });
      if (user) {
        const where = {};
        if (type == 0 || type == 1) {
          where.type = type;
        }

        const include = [
          //Include category list
          {
            model: Category,
            through: {
              attributes: [],
            },
            attributes: ['name'],
          },
        ];

        if (category) include[0].where = { name: category };

        const transactions = await user.getTransactions({
          where,
          include,
          order: [['date', 'DESC']],
          limit: 10,
          offset: offset || 0,
        });
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
    const { desc, date, amount } = req.body;
    const { id } = req.params;

    try {
      const user = await User.findOne({ where: { id: req.userID } });
      if (!user) return res.sendStatus(401);

      let transaction = await Transaction.findOne({ where: { id } });
      if (!transaction) return res.sendStatus(404);

      const isOwner = await user.hasTransaction(transaction);
      if (!isOwner) return res.sendStatus(401);

      transaction = await transaction.update({ desc, date, amount });
      res.json(transaction);
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: { error: err.message } });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findOne({ where: { id: req.userID } });
      if (!user) return res.sendStatus(401);

      let transaction = await Transaction.findOne({ where: { id } });
      if (!transaction) return res.sendStatus(404);

      const isOwner = await user.hasTransaction(transaction);
      if (!isOwner) return res.sendStatus(401);

      await transaction.destroy();
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: { error: err.message } });
    }
  },

  getBalance: async (req, res) => {
    try {
      const user = await User.findOne({ where: { id: req.userID } });
      if (!user) return res.sendStatus(401);

      const transactions = await user.getTransactions({
        order: [['date', 'DESC']],
        include: [
          {
            model: Category,
            through: {
              attributes: [],
            },
            attributes: ['name'],
          },
        ],
      });

      const balance = transactions.reduce(
        (acc, transaction) => acc + transaction.amount * (transaction.type === 0 ? 1 : -1),
        0
      );
      res.json({ balance, transactions: transactions.slice(0, 10) });
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: { error: err.message } });
    }
  },
};
