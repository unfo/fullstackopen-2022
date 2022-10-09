import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import Togglable from './components/Togglable';
import { setInfoMessage, setWarning } from './reducers/notificationReducer';
import { Buffer } from 'buffer';
import { initializeBlogs, newBlog } from './reducers/blogReducer';

const LoginDetails = ({ user, onLogout }) => {
  return (
    <>
      <pre>{user.name} logged in</pre>
      <button onClick={onLogout}>logout</button>
    </>
  );
};

const App = () => {
  //BlogForm
  const blogFormRef = useRef();

  // login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();

  // effects
  // check logged in user + expiry

  const isTokenExpired = (token) => {
    const expiry = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
    return expiry.exp * 1000 < Date.now();
  };
  const clearLoginDetails = () => {
    window.localStorage.removeItem('user');
    blogService.setToken(null);
    setUser(null);
  };
  useEffect(() => {
    const localStorageUser = window.localStorage.getItem('user');
    if (localStorageUser) {
      const user = JSON.parse(localStorageUser);
      if (user) {
        if (isTokenExpired(user.token)) {
          clearLoginDetails();
        } else {
          setUser(user);
          blogService.setToken(user.token);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs());
    }
  }, [user, dispatch]);

  // eventHandlers

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('user', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      dispatch(setInfoMessage(`logged in as ${username}`));
    } catch (exception) {
      dispatch(setWarning('failed to login'));
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    clearLoginDetails();
    dispatch(setInfoMessage('logout success'));
  };

  const addBlog = async (blog) => {
    dispatch(newBlog(blog));
    dispatch(
      setInfoMessage(`New blog added [${blog.title}] by [${blog.author}]`)
    );
    blogFormRef.current.toggleVisibility();
  };

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <input type="submit" value="Login" />
      </form>
    );
  };

  if (user === null) {
    return (
      <>
        <h2>Login required</h2>
        <Notification />
        {loginForm()}
      </>
    );
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <Notification />
        <LoginDetails user={user} onLogout={handleLogout} />
        <Togglable buttonLabel="add blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        <BlogList user={user} />
      </div>
    );
  }
};

export default App;
