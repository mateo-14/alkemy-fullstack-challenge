const { generateToken } = require('../src/controllers/auth.controller');
const sequelize = require('../src/db');
const Category = require('../src/models/Category');
const Transaction = require('../src/models/Transaction');
const User = require('../src/models/User');
const { api } = require('./index');

const users = [
  { email: 'testTransactions@example.com', password: '12345', name: 'Name' },
  { email: 'testTransactions2@example.com', password: '12345', name: 'Name' },
];

const categories = [{ name: 'food' }, { name: 'services' }, { name: 'games' }];

const transactions = [
  { desc: 'Transaction description 1', date: Date.now(), amount: 1200.5, type: 0 },
  { desc: 'Transaction description 2', date: Date.now(), amount: 4500, type: 1 },
  { desc: 'Transaction description 3', date: Date.now(), amount: 3000.99, type: 1 },
  { desc: 'Transaction description 4', date: Date.now(), amount: 50000, type: 0 },
  { desc: 'Transaction description 5', date: Date.now(), amount: 2353.45, type: 0 },
];

let token;
let db = {};

beforeAll(async () => {
  await sequelize.sync();
  db.users = await User.bulkCreate(users);
  db.transactions = await Transaction.bulkCreate(transactions);
  db.categories = await Category.bulkCreate(categories);

  token = await generateToken(db.users[0].id);

  await db.transactions[0].addCategory(db.categories[0]);
  await db.transactions[1].addCategory(db.categories[2]);
  await db.transactions[2].addCategory(db.categories[3]);
  await db.transactions[3].addCategory(db.categories[1]);
  await db.transactions[4].addCategory(db.categories[2]);

  await db.users[0].setTransactions(db.transactions.slice(0, 3));
  await db.users[1].setTransactions(db.transactions.slice(3, 5));
});

describe('GET /transactions', () => {
  const compareTransactions = (dbTransactions, responseTransactions) => {
    expect(responseTransactions).toHaveLength(dbTransactions.length);
    expect(
      responseTransactions.every((transaction) =>
        dbTransactions.some(
          (dbTransaction) =>
            transaction.id === dbTransaction.id &&
            transaction.desc === dbTransaction.desc &&
            transaction.amount === dbTransaction.amount &&
            transaction.type === dbTransaction.type &&
            new Date(transaction.date).getTime() === dbTransaction.date.getTime()
        )
      )
    ).toBeTruthy();
  };

  it('responds with user transactions list', async () => {
    try {
      const res = await api
        .get('/transactions')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const dbUserTransactions = await db.users[0].getTransactions();
      compareTransactions(dbUserTransactions, res.body);
    } catch (err) {
      console.error(err);
    }
  });

  it('responds with user transaction list (Type filter)', async () => {
    const type = 1;
    const res = await api
      .get(`/transactions?type=${type}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const dbUserTransactions = await db.users[0].getTransactions({ where: { type } });
    compareTransactions(dbUserTransactions, res.body);
  });

  it('responds with user transaction list (food category filter)', async () => {
    const category = 'food';
    const res = await api
      .get(`/transactions?category=${category}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.body).toHaveLength(1);
    const dbUserTransactions = await db.users[0].getTransactions({
      include: [
        {
          model: Category,
          where: { name: category },
        },
      ],
    });

    compareTransactions(dbUserTransactions, res.body);
  });

  it('responds 401', async () => {
    await api.get('/transactions').expect(401);
  });
});

describe('POST /transactions', () => {
  it('responds 200 with new transaction', async () => {
    const newTransaction = {
      categories: ['new category'],
      desc: 'New transaction description',
      amount: 20000,
      type: 1,
      date: Date.now(),
    };

    const res = await api
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send(newTransaction)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.body.desc).toBe(newTransaction.desc);
    expect(res.body.amount).toBe(newTransaction.amount);
    expect(res.body.type).toBe(newTransaction.type);
    expect(new Date(res.body.date).getTime()).toBe(newTransaction.date);

    const dbTransaction = await Transaction.findOne({ where: { id: res.body.id } });
    expect(dbTransaction).not.toBeNull();

    expect(dbTransaction.desc).toBe(newTransaction.desc);
    expect(dbTransaction.amount).toBe(newTransaction.amount);
    expect(dbTransaction.type).toBe(newTransaction.type);
    expect(new Date(dbTransaction.date).getTime()).toBe(newTransaction.date);
  });

  it('responds 400 with validator errors', async () => {
    const res = await api
      .post('/transactions')
      .send({})
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.amount).toBeDefined();
    expect(res.body.errors.type).toBeDefined();
    expect(res.body.errors.desc).toBeDefined();
  });

  it('responds 401', async () => {
    await api.post('/transactions').expect(401);
  });
});

describe('PUT /transactions/:id', () => {
  it('responds 200 with updated transaction', async () => {
    let transaction = db.transactions[1];
    const newData = {
      ...transaction,
      desc: 'Updated desc',
      amount: 1405,
      date: new Date('10/9/2021'),
      categories: ['new category', 'new category 1'],
    };
    const res = await api
      .put(`/transactions/${transaction.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.body.desc).toBe(newData.desc);
    expect(res.body.amount).toBe(newData.amount);
    expect(new Date(res.body.date).getTime()).toBe(newData.date.getTime());

    transaction = await Transaction.findOne({ where: { id: transaction.id } });
    const categories = (await transaction.getCategories()).map((category) => category.name);

    expect(transaction.desc).toBe(newData.desc);
    expect(transaction.amount).toBe(newData.amount);
    expect(transaction.date.getTime()).toBe(newData.date.getTime());
    expect(categories).toHaveLength(newData.categories.length);
  });

  it('responds 404', async () => {
    await api.put(`/transactions/randomid`).set('Authorization', `Bearer ${token}`).expect(404);
  });

  it('responds 401', async () => {
    await api.put(`/transactions/${db.transactions[0].id}`).expect(401);
  });

  it("responds 401 (another user's transaction)", async () => {
    const id = db.transactions[db.transactions.length - 1].id;
    await api.put(`/transactions/${id}`).set('Authorization', `Bearer ${token}`).expect(401);
  });
});

describe('DELETE /transactions/:id', () => {
  it('responds 200', async () => {
    const id = db.transactions[2].id;
    await api.delete(`/transactions/${id}`).set('Authorization', `Bearer ${token}`).expect(200);

    const transaction = await Transaction.findOne({ where: { id } });
    expect(transaction).toBeNull();
  });

  it('responds 404', async () => {
    await api.delete(`/transactions/randomid`).set('Authorization', `Bearer ${token}`).expect(404);
  });

  it('responds 401 ', async () => {
    await api.delete(`/transactions/${db.transactions[0].id}`).set('Authorization', 'Bearer randomtoken').expect(401);
  });

  it("responds 401 (another user's transaction)", async () => {
    const id = db.transactions[db.transactions.length - 1].id;
    await api.delete(`/transactions/${id}`).set('Authorization', `Bearer ${token}`).expect(401);
  });
});

describe('GET /transactions/balance', () => {
  it('responds 200 with balance and latest transactions', async () => {
    const res = await api
      .get('/transactions/balance')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const userTransactions = await db.users[0].getTransactions();
    const balance = userTransactions.reduce(
      (acc, transaction) => acc + transaction.amount * (transaction.type === 0 ? 1 : -1),
      0
    );
    expect(res.body.transactions).toHaveLength(userTransactions.length);
    expect(res.body.balance).toBe(balance);
  });

  it('responds 401 ', async () => {
    await api.delete('/transactions/balance').set('Authorization', 'Bearer randomtoken').expect(401);
  });
});
