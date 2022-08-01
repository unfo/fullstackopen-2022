const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs
    .map(blog => blog.likes)
    .reduce((total, current) => total + current, 0);
};

const favoriteBlog = (blogs) => {
  return blogs
    .map(blog => {
      return { 'title': blog.title, 'author': blog.author, 'likes': blog.likes };
    }).sort((a, b) => {
      return (b.likes - a.likes);
    })[0];
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return;
  }

  /* native JS
  const authorBlogCounts = blogs
    .map(blog => blog.author)
    .reduce((blogCounts, author) => {
      blogCounts[author] = blogCounts[author] || 0;
      blogCounts[author] += 1;
      return blogCounts;
    }, {});

  const mostProlific = Object.entries(authorBlogCounts)
    .map(entry => {
      const [author, blogCount] = entry;
      return { 'author': author, 'blogs': blogCount };
    })
    .sort((a, b) => b.blogs - a.blogs);
  */
  // lodash version
  // unsure if better
  const mostBlogsByAuthor = _(blogs)
    .chain()
    .countBy('author')
    .toPairs()
    .map(pair => { return { 'author': pair[0], 'blogs': pair[1] }; })
    .sortBy(['blogs'])
    .last() // sorted ASC => last is biggest
    .value();
  return mostBlogsByAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
};