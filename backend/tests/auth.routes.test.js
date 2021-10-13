require('dotenv').config();
const supertest = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

const api = supertest(app);
const testUser = { email: 'test', password: '123456' };

beforeAll(async () => {
  const user = await User.create(testUser);
  console.log(user.toJSON());
});

describe('POST /auth/register', () => {
  it('should responds 200', async () => {
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

  it('should responds 409 email is already used', async () => {
    const res = await api
      .post('/auth/register')
      .send(testUser)
      .expect(409)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.email).toBe('Email is already used');
  });

  it('should responds 400 email is required', async () => {
    const res = await api
      .post('/auth/register')
      .send({ password: '12jjas' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.email).toBe('Email is required');
  });

  it('should responds 400 password is required', async () => {
    const res = await api
      .post('/auth/register')
      .send({ email: 'email@example.com' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.password).toBe('Password is required');
  });
});

describe('POST /auth/login', () => {
  it('should responds 200', async () => {
    const res = await api
      .post('/auth/login')
      .send(testUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.body.email).toBe(testUser.email);
    expect(res.body.id).toBeDefined();
    expect(res.body.token).toBeDefined();
  });

  it('should responds 400 email is required', async () => {
    const res = await api
      .post('/auth/login')
      .send({ password: '12jjas' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.email).toBe('Email is required');
  });

  it('should responds 400 password is required', async () => {
    const res = await api
      .post('/auth/login')
      .send({ email: 'email@example.com' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(res.body.errors.password).toBe('Password is required');
  });

  it('should responds 401', async () => {
    await api.post('/auth/login').send({ email: testUser.email, password: 'k12431j' }).expect(401);
  });
});
