import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlogList from './components/BlogList';
import BlogForm from './components/BlogForm';

import Notification from './components/Notification';
import UserList from './components/UserList';
import { initializeBlogs, newBlog } from './reducers/blogReducer';
import { restoreStoredLogin } from './reducers/userReducer';
import {
  Routes,
  Route,
  useMatch,
  useNavigate,
  // generatePath,
  // useNavigate,
} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';

const blogPath = '/blogs/:id';
const userPath = '/users/:id';

const App = () => {
  let navigate = useNavigate();

  //BlogForm
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
    navigate('/');
  };

  if (user === null) {
    return (
      <div className="container">
        <h2>Login required</h2>
        <Notification />
        <LoginForm />
      </div>
    );
  } else {
    return (
      <div className="container">
        <Navigation />
        <h1>Ye Wonderful Bloggeth Engine</h1>
        <Notification />

        <Routes>
          <Route path={blogPath} element={<BlogList blogId={blogId} />} />
          <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
          <Route
            path="/"
            element={<BlogList addBlog={addBlog} user={user} />}
          />
          <Route path="/users" element={<UserList />} />
          <Route path={userPath} element={<UserList userId={matchedUser} />} />
        </Routes>
      </div>
    );
  }
};

export default App;
