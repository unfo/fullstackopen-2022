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

describe('4.13 blogilistan laajennus, step1', () => {
  test('a single existing blog can be deleted', async () => {
    const before = await helper.blogsInDb();
    const target = before[0].id;
    await api
      .delete(`/api/blogs/${target}`)
      .expect(204);
    const after = await helper.blogsInDb();
    expect(after.length).toBe(before.length - 1);
    const ids = after.map(blog => blog.id);
    expect(ids).not.toContain(target);
  });
  test('deletion is idempotent so non-existing ids do not cause errors', async () => {
    const target = await helper.nonExistingId();
    await api
      .delete(`/api/blogs/${target}`)
      .expect(204);
  });
});

describe('4.14* blogilistan laajennus, step2', () => {
  test('a blog entry can be updated', async () => {
    const before = await helper.blogsInDb();
    const blog = { ...before[0] };
    blog.likes += 100;
    const result = await api
      .put(`/api/blogs/${blog.id}`)
      .send(blog)
      .expect(200);
    const updatedBlog = result.body;
    expect(updatedBlog).toEqual(blog);
  });
  test('trying to update non-existent id is 404', async () => {
    const id = await helper.nonExistingId();
    const emptyBlog = {};
    await api
      .put(`/api/blogs/${id}`)
      .send(emptyBlog)
      .expect(404);
    const blogs = await helper.blogsInDb();
    console.log('Blogs in DB: ', blogs);
  });

  test('trying to update malformed id is 400', async () => {
    const id = 'foobar';
    const emptyBlog = {};
    await api
      .put(`/api/blogs/${id}`)
      .send(emptyBlog)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});