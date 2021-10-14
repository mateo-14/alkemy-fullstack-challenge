const { generateToken } = require('../src/controllers/auth.controller');
const Category = require('../src/models/Category');
const Transaction = require('../src/models/Transaction');
const User = require('../src/models/User');
const { api } = require('./index');

const users = [
  { email: 'testTransactions@example.com', password: '12345' },
  { email: 'testTransactions@example.com', password: '12345' },
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
  db.users = await User.bulkCreate(users);
  db.transactions = await Transaction.bulkCreate(transactions);
  db.categories = await Category.bulkCreate(categories);

  token = generateToken(db.users[0]);

  await db.transactions[0].addCategory(db.categories[0]);
  await db.transactions[1].addCategory(db.categories[1]);
  await db.transactions[2].addCategory(db.categories[3]);
  await db.transactions[3].addCategory(db.categories[1]);
  await db.transactions[4].addCategory(db.categories[0]);

  await db.users[0].setTransactions(db.transactions.slice(0, 3));
  await db.users[1].setTransactions(db.transactions.slice(3, 5));
});

describe('GET /transactions', () => {
  const compareTransactions = (dbTransactions, responseTransactions) => {
    transactionsList.toHaveLength(dbUserTransactions.length);
    expect(
      responseTransactions.every((transaction) =>
        dbTransactions.some(
          (dbTransaction) =>
            transaction.desc === dbTransaction.desc &&
            transaction.amount === dbTransaction.amount &&
            transaction.type === dbTransaction.type &&
            transaction.date === dbTransaction.date
        )
      )
    ).toBeTruthy();
  };

  it('should responds with user transactions list', async () => {
    const res = await api
      .get('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);

    const dbUserTransactions = await db.users[0].getTransactions();
    compareTransactions(dbUserTransactions, res.body);
  });

  it('should responds with user transaction list (Type filter)', async () => {
    const type = 1;
    const res = await api
      .get(`/transactions?type=${type}`)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);

    const dbUserTransactions = await db.users[0].getTransactions({ where: { type } });
    compareTransactions(dbUserTransactions, res.body);
  });

  it('should responds with user transaction list (food category filter)', async () => {
    const category = 'food';
    const res = await api
      .get(`/transactions?category=${category}`)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-Type', /application\/json/);

    const dbUserTransactions = await db.users[0].getTransactions({ where: { category } });
    compareTransactions(dbUserTransactions, res.body);
  });

  it('should responds 401', async () => {
    await api.get('/transactions').toBe(401);
  });
});

describe('POST /transactions', () => {
  it('should responds with 200', async () => {
    const newTransaction = {
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
    expect(res.body.date).toBe(newTransaction.date);

    const dbTransaction = await Transaction.findOne({ where: { id: res.body.id } });
    expect(dbTransaction).not.toBeNull();

    expect(dbTransaction.desc).toBe(newTransaction.desc);
    expect(dbTransaction.amount).toBe(newTransaction.amount);
    expect(dbTransaction.type).toBe(newTransaction.type);
    expect(dbTransaction.date).toBe(newTransaction.date);
  });

  it('should responds 400 description is required', async () => {
    const res = await api
      .post('/transactions')
      .send({ amount: 200, type: 0 })
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.desc).toBeDefined();
  });
  it('should responds 400 amount is required', async () => {
    const res = await api
      .post('/transactions')
      .send({ desc: 'random desc', type: 1 })
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.amount).toBeDefined();
  });
  it('should responds 400 type is required', async () => {
    const res = await api
      .post('/transactions')
      .send({ desc: 'random desc', amount: 200 })
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.type).toBeDefined();
  });

  it('should responds 401', async () => {
    await api.post('/transactions').expect(401);
  });
});

describe('PUT /transactions/:id', () => {
  it('should responds with 200', async () => {
    let transaction = db.transactions[1];
    const newData = { ...transaction, desc: 'Updated desc', amount: 1405, date: new Date('10/9/2021') };
    const res = await api
      .put(`/transactions/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newData)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    res.body.desc.toBe(newData.desc);
    res.body.amount.toBe(newData.amount);
    res.body.date.toBe(newData.date);

    const transaction = await Transaction.findOne({ where: { id } });
    transaction.desc.toBe(newData.desc);
    transaction.amount.toBe(newData.amount);
    transaction.date.toBe(newData.date);
  });

  it('should responds 404', async () => {
    await api.put(`/transactions/randomid`).set('Authorization', `Bearer ${token}`).expect(404);
  });

  it('should responds 401', async () => {
    await api.put(`/transactions/${db.transactions[0].id}`).expect(401);
  });

  it("should responds 401 (another user's transaction)", async () => {
    const id = db.transactions[db.transactions.length - 1].id;
    await api.put(`/transactions/${id}`).set('Authorization', `Bearer ${token}`).expect(401);
  });
});

describe('DELETE /transactions/:id', () => {
  it('should responds with 200', async () => {
    const id = db.transactions[2].id;
    await api.delete(`/transactions/${id}`).set('Authorization', `Bearer ${token}`).expect(200);

    const transaction = await Transaction.findOne({ where: { id } });
    expect(transaction).toBeNull();
  });

  it('should responds 404', async () => {
    await api.delete(`/transactions/randomid`).set('Authorization', `Bearer ${token}`).expect(404);
  });

  it('should responds 401 ', async () => {
    await api.delete(`/transactions/${db.transactions[0].id}`).set('Authorization', 'Bearer randomtoken').expect(401);
  });

  it("should responds 401 (another user's transaction)", async () => {
    const id = db.transactions[db.transactions.length - 1].id;
    await api.delete(`/transactions/${id}`).set('Authorization', `Bearer ${token}`).expect(401);
  });
});
