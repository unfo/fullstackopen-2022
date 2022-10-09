import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { setInfoMessage } from '../reducers/notificationReducer';
import { logout } from '../reducers/userReducer';
import LoginForm from './LoginForm';

const LoginDetails = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
    dispatch(setInfoMessage('logout success'));
  };

  if (!user) {
    return <LoginForm />;
  } else {
    return (
      <>
        <pre>{user.name} logged in</pre>
        <button onClick={onLogout}>logout</button>
      </>
    );
  }
};

export default LoginDetails;
