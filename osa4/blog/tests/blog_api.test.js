/* eslint-disable no-console */
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const loginHelper = require('../utils/login_helper.js');

const MOCKUP_USER_CREDS =  { username: 'mockup_user', passwordHash: '3732ae9d266a0f9a35b8ed26d08086fccb693dc0' }; // used only in these tests

beforeEach(async () => {
  await User.deleteMany({});
  const user = new User(MOCKUP_USER_CREDS);
  const root = await user.save();
  await Blog.deleteMany({});
  const initialBlogs = helper.getInitialBlogs(root.id);
  await Blog.insertMany(initialBlogs);
});

const createBearerToken = async (creds) => {
  if (!creds) {
    const user = await User.findOne({});
    creds = { username: user.username, id: user.id };
  }
  return loginHelper.tokenFor(creds);
};

describe('4.8: blogilistan testit, step 1', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.getInitialBlogs().length);
  });
});

describe('4.9*: blogilistan testit, step2', () => {
  test('blog is identified by [id] parameter', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;
    const first = blogs[0];
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
    const token = await createBearerToken();
    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const blogs = await helper.blogsInDb();
    expect(blogs.length).toBe(helper.getInitialBlogs().length + 1);
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
    const token = await createBearerToken();
    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
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
    const token = await createBearerToken();
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(missingTitle)
      .expect(400);

    const blogs = await helper.blogsInDb();
    expect(blogs.length).toBe(helper.getInitialBlogs().length);
  });
  test('url is required', async () => {
    const missingUrl = { ...newBlog };
    delete missingUrl.url;
    const token = await createBearerToken();

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(missingUrl)
      .expect(400);

    const blogs = await helper.blogsInDb();
    expect(blogs.length).toBe(helper.getInitialBlogs().length);
  });

});

describe('4.13 blogilistan laajennus, step1', () => {
  test('a single existing blog can be deleted', async () => {
    const before = await helper.blogsInDb();
    const target = before[0].id;
    const token = await createBearerToken();
    await api
      .delete(`/api/blogs/${target}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
    const after = await helper.blogsInDb();
    expect(after.length).toBe(before.length - 1);
    const ids = after.map(blog => blog.id);
    expect(ids).not.toContain(target);
  });
  test('deletion is idempotent so non-existing ids do not cause errors', async () => {
    const target = await helper.nonExistingId();
    const token = await createBearerToken();
    await api
      .delete(`/api/blogs/${target}`)
      .set('Authorization', `Bearer ${token}`)
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
    expect(updatedBlog.likes).toEqual(blog.likes);
  });
  test('trying to update non-existent id is 404', async () => {
    const id = await helper.nonExistingId();
    const emptyBlog = {};
    await api
      .put(`/api/blogs/${id}`)
      .send(emptyBlog)
      .expect(404);
    // const blogs = await helper.blogsInDb();
    // console.log('Blogs in DB: ', blogs);
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

describe('4.23*: blogilistan laajennus, step11', () => {
  test('blogs have user attached', async () => {
    const firstBlog = await Blog.findOne({}).populate('user');
    expect(firstBlog.user.id).toBeDefined();
  });
  test('creating blogs requirez a valid token', async () => {
    const newBlog = {
      title: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
      author: 'Robert Hobart Davis',
      url: 'https://en.wikipedia.org/wiki/How_much_wood_would_a_woodchuck_chuck',
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);
  });
  test('deleting someone else\'s blogs is not allowed', async () => {
    const before = await helper.blogsInDb();
    const target = before[0].id;
    const newUser = new User({ username: 'notroot', passwordHash: 'notahash' });
    const savedUser = await newUser.save();
    const token = await createBearerToken({
      username: savedUser.username,
      id: savedUser.id,
    });
    await api
      .delete(`/api/blogs/${target}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
    const after = await helper.blogsInDb();
    expect(after.length).toBe(before.length);

  });
});

afterAll(() => {
  mongoose.connection.close();
});