const { api } = require('./index');
const User = require('../src/models/User');
const sequelize = require('../src/db');

const testUser = { email: 'testRoutes@example.com', password: '123456' };

beforeAll(async () => {
  await sequelize.sync();
  await User.create(testUser);
});

describe('POST /auth/register', () => {
  it('responds (200) with user', async () => {
    const newUser = { email: 'nico14', password: '123456' };
    const res = await api
      .post('/auth/register')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.body.email).toBe(newUser.email);
    expect(res.body.id).toBeDefined();
    expect(res.body.token).toBeDefined();
  });

  it('responds (409) with error: email is already used', async () => {
    const res = await api
      .post('/auth/register')
      .send(testUser)
      .expect(409)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.email).toBe('Email is already used');
  });

  it('responds (400) with error: email is required', async () => {
    const res = await api
      .post('/auth/register')
      .send({ password: '12jjas' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.email).toBe('Email is required');
  });

  it('responds (400) with error: password is required', async () => {
    const res = await api
      .post('/auth/register')
      .send({ email: 'email@example.com' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.password).toBe('Password is required');
  });
});

describe('POST /auth/login', () => {
  it('responds (200) with token', async () => {
    const res = await api
      .post('/auth/login')
      .send(testUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.body.email).toBe(testUser.email);
    expect(res.body.id).toBeDefined();
    expect(res.body.token).toBeDefined();
  });

  it('responds (400) with error: email is required', async () => {
    const res = await api
      .post('/auth/login')
      .send({ password: '12jjas' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.email).toBe('Email is required');
  });

  it('responds (400) with error: password is required', async () => {
    const res = await api
      .post('/auth/login')
      .send({ email: 'email@example.com' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.password).toBe('Password is required');
  });

  it('responds 401', async () => {
    await api.post('/auth/login').send({ email: testUser.email, password: 'k12431j' }).expect(401);
  });
});

describe('GET /auth', () => {
  it('responds (200) with a new token', async () => {
    const res = await api.get('/auth').set('Authorization', `Bearer ${token}`).expect(200);
    expect(res.body.token).toBeDefined();
  });

  it('responds 401', async () => {
    await api.get('/auth').expect(401);
  });
});
