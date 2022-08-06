import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  // blogs
  const [blogs, setBlogs] = useState([]);

  // login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // effects
  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      );
    }
  }, [user]);

  // helpers
  const showNotification = (message, messageType) => {
    window.alert(`${messageType}: ${message}`);
  };

  // eventHandlers

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);
    try {
      const user = await loginService.login({ username, password, });
      setUser(user);
      setUsername('');
      setPassword('');
      showNotification(`logged in as ${username}`, 'success');
    } catch (exception) {
      showNotification('wrong credentials', 'fail');
    }
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
        {loginForm()}
      </>
    );
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <pre>{user.name} logged in</pre>
        {
          blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )
        }
      </div>
    );
  }
};

export default App;
