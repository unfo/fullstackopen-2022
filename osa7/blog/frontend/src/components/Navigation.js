import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoginDetails from './LoginDetails';
import LogoutButton from './LogoutButton';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav variant="tabs" className="mr-auto">
          <Nav.Item>
            <Link className="nav-link" to="/">
              blogs list
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/create">
              create new
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link className="nav-link" to="/users">
              users
            </Link>
          </Nav.Item>
          <Nav.Item>
            <LoginDetails />
          </Nav.Item>
          <Nav.Item>
            <LogoutButton />
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
