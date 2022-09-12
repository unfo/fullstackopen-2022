const bcrypt = require('bcrypt');
const User = require('../models/user');
const helper = require('./test_helper');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

describe('4.16*: blogilistan laajennus, step4', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'starlord',
      name: 'Peter Quill',
      password: 'Gamora',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
  test('username must be unique', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'root',
      password: 'root',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
  test('username is min 3 chars in length', async () => {
    const newUser = {
      username: 'jw',
      name: 'jw',
      password: 'awesomestPassword',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    const error = result.body.error;
    expect(error).toContain('Path `username`');
    expect(error).toContain('minimum allowed length');
  });
  test('password is min 3 chars in length', async () => {
    const newUser = {
      username: 'jan',
      name: 'jw',
      password: 'jw',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    const error = result.body.error;
    expect(error).toContain('password minimum length');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
