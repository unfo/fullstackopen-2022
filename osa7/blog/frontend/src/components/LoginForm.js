import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setInfoMessage, setWarning } from '../reducers/notificationReducer';
import { attemptLogin } from '../reducers/userReducer';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const loginHandler = async (event) => {
    event.preventDefault();
    console.log('dispatching login with', username, password);
    try {
      await dispatch(attemptLogin(username, password));
      dispatch(setInfoMessage(`logged in as ${username}`));
      setUsername('');
      setPassword('');
    } catch (exception) {
      dispatch(setWarning('failed to login'));
    }
  };

  return (
    <form onSubmit={loginHandler}>
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

export default LoginForm;
