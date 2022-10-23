import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import LoginDetails from './components/LoginDetails';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import UserList from './components/UserList';
import { initializeBlogs, newBlog } from './reducers/blogReducer';
import { setInfoMessage } from './reducers/notificationReducer';
import { restoreStoredLogin } from './reducers/userReducer';

import {
  Routes,
  Route,
  Link,
  useMatch,
  // generatePath,
  // useNavigate,
} from 'react-router-dom';

const blogPath = '/blogs/:id';
const userPath = '/users/:id';

const Menu = () => {
  return (
    <>
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>
      <LoginDetails />
    </>
  );
};

const App = () => {
  //BlogForm
  const blogFormRef = useRef();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const blogMatch = useMatch(blogPath);
  const blogId = blogMatch ? blogMatch.params.id : null;

  const userMatch = useMatch(userPath);
  const matchedUser = userMatch ? userMatch.params.id : null;

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
        <Menu />
        <h2>blogs</h2>
        <Notification />
        <Togglable buttonLabel="add blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <Routes>
          <Route path={blogPath} element={<BlogList blogId={blogId} />} />
          <Route path="/" element={<BlogList user={user} />} />
          <Route path="/users" element={<UserList />} />
          <Route path={userPath} element={<UserList userId={matchedUser} />} />
        </Routes>
      </div>
    );
  }
};

export default App;
