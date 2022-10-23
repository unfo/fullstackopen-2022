import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { generatePath } from 'react-router-dom';
import { deleteBlog, voteFor } from '../reducers/blogReducer';
import { setNotification, setWarning } from '../reducers/notificationReducer';
import Blog from './Blog';

const blogPath = '/blogs/:id';

const BlogList = ({ blogId }) => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const likeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id);
    dispatch(voteFor(id));
    dispatch(setNotification(`You liked ${blog.title}`));
  };

  const removeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id);
    dispatch(deleteBlog(blog));
    dispatch(setWarning(`Deleted blog [${blog.title}] by [${blog.author}]`));
  };

  if (blogs.length > 0 && blogId) {
    const blog = blogs.find((b) => b.id === blogId);
    return (
      <Blog
        key={blog.id}
        blog={blog}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
        currentUser={user ? user.username : null}
      />
    );
  } else {
    return (
      <Container>
        <ul>
          {blogs &&
            [...blogs] // sort would try to in-place order items. blogs is const.
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <li key={blog.id}>
                  <Link to={generatePath(blogPath, { id: blog.id })}>
                    {blog.title} - {blog.author}
                  </Link>
                </li>
              ))}
        </ul>
      </Container>
    );
  }
};

export default BlogList;
