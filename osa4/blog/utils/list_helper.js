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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};