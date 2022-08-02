/* eslint-disable no-console */
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe('4.8: blogilistan testit, step 1', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe('4.9*: blogilistan testit, step2', () => {
  test('blog is identified by [id] parameter', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;
    console.log(blogs);
    const first = blogs[0];
    console.log(first);
    expect(first.id).toBeDefined();
    expect(first._id).not.toBeDefined();
  });
});


afterAll(() => {
  mongoose.connection.close();
});