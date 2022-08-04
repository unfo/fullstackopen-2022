const blogRouter = require('express').Router();
const Blog = require('../models/blog');


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});



blogRouter.post('/', async (request, response) => {
  const user = request.user;
  const blog = new Blog(request.body);
  blog.user = user.id;
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    if (blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({
        error: 'Permission denied. Can only delete own blog posts.'
      });
    }
    await blog.remove();
    user.blogs = user.blogs.filter(blog => blog.id !== request.params.id);
    await user.save();
  }
  response.status(204).end();
});

blogRouter.put('/:id', async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

module.exports = blogRouter;