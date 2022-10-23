import { Link } from 'react-router-dom';
import { generatePath } from 'react-router-dom';

const UserDetails = ({ user }) => {
  const blogPath = '/blogs/:id';
  return (
    <>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={generatePath(blogPath, { id: blog.id })}>
              {blog.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserDetails;
