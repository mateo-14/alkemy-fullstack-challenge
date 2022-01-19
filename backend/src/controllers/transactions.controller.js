const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const sequelize = require('../db');

module.exports = {
  get: async (req, res) => {
    const { type, categories, offset } = req.query;
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

        if (categories && categories instanceof Array) include[0].where = { name: categories };

        const transactions = await user.getTransactions({
          where,
          include,
          order: [['date', 'DESC']],
          limit: 3,
          offset: offset || 0,
        });
        res.json(
          transactions.map((transaction) => ({
            ...transaction.toJSON(),
            categories: transaction.categories.map((category) => category.name),
          })),
        );
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
    if (type == undefined) validatorErrors.type = 'Type is required';
    if (!amount) validatorErrors.amount = 'Amount is required';

    if (Object.keys(validatorErrors).length > 0)
      return res.status(400).json({ errors: validatorErrors });
    const newTransaction = {
      desc,
      amount,
      type: Math.min(type, 1),
      date: date ? new Date(date) : Date.now(),
    };

    try {
      const user = await User.findOne({ where: { id: req.userID } });
      if (!user) return res.sendStatus(401);

      const transaction = await Transaction.create(newTransaction);
      await user.addTransaction(transaction);

      if (categories instanceof Array && categories.length > 0) {
        let dbCategories = await Promise.all(
          categories.map((name) => Category.findOrCreate({ where: { name } })),
        );
        dbCategories = dbCategories.map(([category]) => category);
        await transaction.addCategories(dbCategories);
        return res.json({
          ...transaction.toJSON(),
          categories: dbCategories.map((category) => category.name),
        });
      }
      res.json({ ...transaction.toJSON(), categories: [] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: { error: err.message } });
    }
  },

  update: async (req, res) => {
    const { desc, date, amount, categories } = req.body;
    const { id } = req.params;

    try {
      const user = await User.findOne({ where: { id: req.userID } });
      if (!user) return res.sendStatus(401);

      let transaction = await Transaction.findOne({ where: { id } });
      if (!transaction) return res.sendStatus(404);

      const isOwner = await user.hasTransaction(transaction);
      if (!isOwner) return res.sendStatus(401);

      transaction = await transaction.update({ desc, date, amount });

      //Update categories
      const dbCategories = await transaction.getCategories();
      const categoriesToRemove = dbCategories.filter(
        (category) => !categories.includes(category.name),
      );
      await transaction.removeCategories(categoriesToRemove);

      const categoriesToAdd = categories.filter(
        (name) => !dbCategories.some((category) => category.name === name),
      );
      //sequelize.transaction() sqlite :memory: not work without this
      const newCategories = await sequelize.transaction((t) =>
        Promise.all(
          categoriesToAdd.map((name) => Category.findOrCreate({ where: { name }, transaction: t })),
        ),
      );

      await transaction.addCategories(newCategories.map(([category]) => category));
      const updatedCategories = await transaction.getCategories();

      res.json({
        ...transaction.toJSON(),
        categories: updatedCategories.map((category) => category.name),
      });
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

      const expense = transactions.reduce(
        (acc, transaction) => acc + (transaction.type === 1 ? transaction.amount : 0),
        0,
      );
      const income = transactions.reduce(
        (acc, transaction) => acc + (transaction.type === 0 ? transaction.amount : 0),
        0,
      );

      const categories = [
        ...new Set(
          transactions
            .map((transaction) => transaction.categories.map((category) => category.name))
            .reduce((acc, categories) => acc.concat(categories), []),
        ),
      ];
      res.json({
        balance: income - expense,
        income,
        expense,
        transactions: transactions.slice(0, 10).map((transaction) => ({
          ...transaction.toJSON(),
          categories: transaction.categories.map((category) => category.name),
        })),
        categories,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: { error: err.message } });
    }
  },
};
