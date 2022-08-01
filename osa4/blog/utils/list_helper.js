// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs
    .map(blog => blog.likes)
    .reduce((total, current) => total + current, 0);
};

module.exports = {
  dummy,
  totalLikes,
};