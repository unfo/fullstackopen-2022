const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', (_, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

module.exports = blogRouter;