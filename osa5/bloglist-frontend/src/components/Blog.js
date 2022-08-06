import { useState } from 'react';

const Blog = ({ blog, likeBlog, removeBlog, currentUser }) => {
  const loggedIn = currentUser !== null;
  const isOwnBlog = loggedIn ? blog.user.username === currentUser.username : false;
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
        <p>{blog.likes} <button onClick={like}>like</button></p>
        <p>{blog.author}</p>
        { isOwnBlog && deleteButton() }
      </>
    );
  };
  const blogSummary = () => (
    <button onClick={(event) => { openDetails(event); }}>{icons[status]} {blog.title} - {blog.author}</button>
  );

  return (
    <div className="blog">
      {status === 'open' ? blogDetails() : blogSummary() }
    </div>
  );
};

export default Blog;