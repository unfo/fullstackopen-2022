import { useSelector } from 'react-redux';

const LoginDetails = () => {
  const user = useSelector((state) => state.user);

  return (
    <span className="nav-link">
      logged in as <span className="tt">{user.name}</span>
    </span>
  );
};

export default LoginDetails;
