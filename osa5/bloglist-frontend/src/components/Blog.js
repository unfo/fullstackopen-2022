import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, likeBlog, removeBlog, currentUser }) => {
  const loggedIn = currentUser !== null && currentUser !== undefined;
  const isOwnBlog = loggedIn ? blog.user.username === currentUser : false;
  const [status, setStatus] = useState('closed');
  const icons = {
    closed: '▶️',
    open: '🔽',
  };
  const openDetails = (event) => {
    event.preventDefault();
    setStatus(status === 'open' ? 'closed' : 'open');
  };
  const like = (event) => {
    event.preventDefault();
    const likedBlog = { ...blog };
    likedBlog.likes += 1;
    likeBlog(likedBlog);
  };

  const deleteBlog = (event) => {
    event.preventDefault();
    if (window.confirm(`Remove [${blog.title}] by [${blog.author}]`)) {
      removeBlog(blog.id);
    }
  };

  const deleteButton = () => (
    <button onClick={deleteBlog}>delete blog</button>
  );

  const blogDetails = () => {
    return (
      <>
        <button onClick={(event) => { openDetails(event); }}>{icons[status]} {blog.title}</button>
        <p>{blog.url}</p>
        <p>{blog.likes} like(s) - <button className='smashThatLikeButton' onClick={like}>like</button></p>
        <p>{blog.author}</p>
        { isOwnBlog && deleteButton() }
      </>
    );
  };
  const blogSummary = () => (
    <button className='openDetails' onClick={(event) => { openDetails(event); }}>{icons[status]} {blog.title} - {blog.author}</button>
  );

  return (
    <div className="blog">
      {status === 'open' ? blogDetails() : blogSummary() }
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