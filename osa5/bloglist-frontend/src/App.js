import { useState, useEffect, useRef } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';

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

  // notification
  const emptyNotification = {
    message: null,
    messageType: null
  };
  const [notification, setNotification] = useState(emptyNotification);

  const showNotification = (message, type) => {
    console.log('showNotification: ', message, type);
    const timeoutLengths = {
      'success': 3000,
      'fail': 5000
    };
    setNotification({
      message: message,
      messageType: type
    });
    setTimeout(() => {
      setNotification(emptyNotification);
    }, timeoutLengths[type]);
  };

  // effects
  useEffect(() => {
    const localStorageUser = window.localStorage.getItem('user');
    if (localStorageUser) {
      const user = JSON.parse(localStorageUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      );
    }
  }, [user]);

  // eventHandlers

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);
    try {
      const user = await loginService.login({ username, password, });
      window.localStorage.setItem('user', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      showNotification(`logged in as ${username}`, 'success');
    } catch (exception) {
      showNotification('wrong credentials', 'fail');
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('user');
    blogService.setToken(null);
    setUser(null);
    showNotification('logged out', 'success');
  };

  const addBlog = async (blog) => {
    const savedBlog = await blogService.create(blog);
    setBlogs(blogs.concat(savedBlog));
    showNotification(`New blog added [${savedBlog.title}] by [${savedBlog.author}]`, 'success');
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
          onChange={({ target }) => setUsername(target.value) }
        />
        <br/>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          name="password"
          value={password}
          onChange={({ target }) => setPassword(target.value) }
        />
        <br/>
        <input type="submit" value="Login" />
      </form>
    );
  };



  if (user === null) {
    return (
      <>
        <h2>Login required</h2>
        <Notification message={notification.message} messageType={notification.messageType} />
        {loginForm()}
      </>
    );
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={notification.message} messageType={notification.messageType} />
        <LoginDetails user={user} onLogout={handleLogout} />
        <Togglable buttonLabel='add blog' ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {
          blogs.sort((a,b) => b.likes - a.likes).map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              likeBlog={likeBlog}
              removeBlog={removeBlog}
              currentUser={user ? user.username : null} />
          )
        }
      </div>
    );
  }
};

export default App;
