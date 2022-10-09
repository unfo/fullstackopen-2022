import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import LoginDetails from './components/LoginDetails';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import { initializeBlogs, newBlog } from './reducers/blogReducer';
import { setInfoMessage } from './reducers/notificationReducer';
import { restoreStoredLogin } from './reducers/userReducer';

const App = () => {
  //BlogForm
  const blogFormRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(restoreStoredLogin());
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs());
    }
  }, [user]);

  // eventHandlers

  const addBlog = async (blog) => {
    dispatch(newBlog(blog));
    dispatch(
      setInfoMessage(`New blog added [${blog.title}] by [${blog.author}]`)
    );
    blogFormRef.current.toggleVisibility();
  };

  if (user === null) {
    return (
      <>
        <h2>Login required</h2>
        <Notification />
        <LoginDetails />
      </>
    );
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <LoginDetails />
        <Togglable buttonLabel="add blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <BlogList user={user} />
      </div>
    );
  }
};

export default App;
