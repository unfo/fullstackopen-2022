import { Nav } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setInfoMessage } from '../reducers/notificationReducer';
import { logout } from '../reducers/userReducer';

const LogoutButton = () => {
  const dispatch = useDispatch();

  const onLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
    dispatch(setInfoMessage('logout success'));
  };

  return (
    <Nav.Link as="span" onClick={onLogout}>
      logout
    </Nav.Link>
  );
};

export default LogoutButton;
