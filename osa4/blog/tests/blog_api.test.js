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

describe('4.10: blogilistan testit, step3', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
      author: 'Robert Hobart Davis',
      url: 'https://en.wikipedia.org/wiki/How_much_wood_would_a_woodchuck_chuck',
      likes: 0
    };
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const blogs = await helper.blogsInDb();
    expect(blogs.length).toBe(helper.initialBlogs.length + 1);
    const titles = blogs.map(blog => blog.title);
    expect(titles).toContain(newBlog.title);
  });
});
describe('4.11*: blogilistan testit, step4', () => {
  test('default value for likes is set as 0', async () => {
    const newBlog = {
      title: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
      author: 'Robert Hobart Davis',
      url: 'https://en.wikipedia.org/wiki/How_much_wood_would_a_woodchuck_chuck',
    };
    const response = await api.post('/api/blogs').send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const savedBlog = response.body;
    expect(savedBlog.likes).toBe(0);
  });
});

describe('4.12*: blogilistan testit, step5', () => {
  const newBlog = {
    title: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
    author: 'Robert Hobart Davis',
    url: 'https://en.wikipedia.org/wiki/How_much_wood_would_a_woodchuck_chuck',
  };
  test('title is required', async () => {
    const missingTitle = { ...newBlog };
    delete missingTitle.title;

    await api
      .post('/api/blogs')
      .send(missingTitle)
      .expect(400);

    const blogs = await helper.blogsInDb();
    expect(blogs.length).toBe(helper.initialBlogs.length);
  });
  test('url is required', async () => {
    const missingUrl = { ...newBlog };
    delete missingUrl.url;

    await api
      .post('/api/blogs')
      .send(missingUrl)
      .expect(400);

    const blogs = await helper.blogsInDb();
    expect(blogs.length).toBe(helper.initialBlogs.length);
  });

});

afterAll(() => {
  mongoose.connection.close();
});