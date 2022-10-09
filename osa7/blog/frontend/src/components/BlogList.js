import { useDispatch, useSelector } from 'react-redux';
import { deleteBlog, voteFor } from '../reducers/blogReducer';
import { setNotification, setWarning } from '../reducers/notificationReducer';
import Blog from './Blog';

const BlogList = ({ user }) => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

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

  return (
    <>
      {blogs &&
        [...blogs] // sort would try to in-place order items. blogs is const.
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              likeBlog={likeBlog}
              removeBlog={removeBlog}
              currentUser={user ? user.username : null}
            />
          ))}
    </>
  );
};

export default BlogList;
