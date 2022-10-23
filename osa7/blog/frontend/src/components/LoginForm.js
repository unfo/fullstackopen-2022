import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setInfoMessage, setWarning } from '../reducers/notificationReducer';
import { attemptLogin } from '../reducers/userReducer';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const loginHandler = async (event) => {
    event.preventDefault();
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
    <Form onSubmit={loginHandler}>
      <Row>
        <Col>
          <Form.Control
            id="username"
            name="username"
            value={username}
            placeholder="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Col>
        <Col>
          <Form.Control
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Col>
        <Col>
          <Button type="submit">Login</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default LoginForm;
