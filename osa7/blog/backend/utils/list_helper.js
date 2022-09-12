const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs
    .map((blog) => blog.likes)
    .reduce((total, current) => total + current, 0);
};

const favoriteBlog = (blogs) => {
  return blogs
    .map((blog) => {
      return { title: blog.title, author: blog.author, likes: blog.likes };
    })
    .sort((a, b) => {
      return b.likes - a.likes;
    })[0];
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return;
  }

  // found better lodash way
  const mostBlogsByAuthor = _(blogs)
    .countBy('author')
    .map((blogs, author) => ({ author, blogs }))
    .sortBy('blogs')
    .last(); // sorted ASC => last is biggest
  return mostBlogsByAuthor;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return;
  }
  return _(blogs)
    .groupBy('author')
    .map((blogByAuthor, author) => ({
      author: author,
      likes: _.sumBy(blogByAuthor, 'likes'),
    }))
    .sortBy('likes')
    .last();
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
