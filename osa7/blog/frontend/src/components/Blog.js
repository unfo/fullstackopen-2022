import PropTypes from 'prop-types';

const Blog = ({ blog, likeBlog, removeBlog, currentUser }) => {
  const loggedIn = currentUser !== null && currentUser !== undefined;
  const isOwnBlog = loggedIn ? blog.user.username === currentUser : false;

  const like = (event) => {
    event.preventDefault();
    likeBlog(blog.id);
  };

  const deleteBlog = (event) => {
    event.preventDefault();
    if (window.confirm(`Remove [${blog.title}] by [${blog.author}]`)) {
      removeBlog(blog.id);
    }
  };

  const deleteButton = () => <button onClick={deleteBlog}>delete blog</button>;

  return (
    <div className="blog">
      <h1>
        {blog.title} - {blog.author}
      </h1>
      <p>
        <a href={blog.url}>{blog.url}</a>
      </p>
      <p>
        {blog.likes} like(s) -{' '}
        <button className="smashThatLikeButton" onClick={like}>
          like
        </button>
      </p>
      <p>added by {blog.user.name}</p>
      {isOwnBlog && deleteButton()}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  currentUser: PropTypes.string,
};

export default Blog;
