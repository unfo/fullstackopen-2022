import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import { setInfoMessage, setWarning } from './reducers/notificationReducer';
import { Buffer } from 'buffer';

const LoginDetails = ({ user, onLogout }) => {
  return (
    <>
      <pre>{user.name} logged in</pre>
      <button onClick={onLogout}>logout</button>
    </>
  );
};

const App = () => {
  // blogs
  const [blogs, setBlogs] = useState([]);

  //BlogForm
  const blogFormRef = useRef();

  // login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // effects
  useEffect(() => {
    const localStorageUser = window.localStorage.getItem('user');
    if (localStorageUser) {
      const user = JSON.parse(localStorageUser);
      if (user) {
        console.log(user.token);
        const expiry = JSON.parse(
          Buffer.from(user.token.split('.')[1], 'base64')
        );
        if (expiry.exp * 1000 < Date.now()) {
          window.localStorage.removeItem('user');
          blogService.setToken(null);
          setUser(null);
        } else {
          setUser(user);
          blogService.setToken(user.token);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  const dispatch = useDispatch();

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
    window.localStorage.removeItem('user');
    blogService.setToken(null);
    setUser(null);
    dispatch(setInfoMessage('logout success'));
  };

  const addBlog = async (blog) => {
    const savedBlog = await blogService.create(blog);
    setBlogs(blogs.concat(savedBlog));
    dispatch(
      setInfoMessage(
        `New blog added [${savedBlog.title}] by [${savedBlog.author}]`
      )
    );
    blogFormRef.current.toggleVisibility();
  };

  const likeBlog = async (blog) => {
    await blogService.update(blog.id, blog);
    const updatedBloglist = await blogService.getAll();
    setBlogs(updatedBloglist);
  };

  const removeBlog = async (id) => {
    await blogService.remove(id);
    const updatedBloglist = await blogService.getAll();
    setBlogs(updatedBloglist);
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
        {blogs
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
      </div>
    );
  }
};

export default App;
