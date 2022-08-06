import { useState } from 'react';

const Blog = ({ blog, likeBlog }) => {
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

  const blogDetails = () => {
    return (
      <>
        <button onClick={(event) => { openDetails(event); }}>{icons[status]} {blog.title}</button>
        <p>{blog.url}</p>
        <p>{blog.likes} <button onClick={like}>like</button></p>
        <p>{blog.author}</p>
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