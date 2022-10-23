import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import usersService from '../services/users';
import UserDetails from './UserDetails';

const UserList = ({ userId }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function getUsers() {
      const response = await usersService.getAll();
      setUsers(response);
    }
    getUsers();
  }, []);

  if (!users || users.length === 0) {
    return null;
  }
  if (userId) {
    const selectedUser = users.find((u) => u.id === userId);
    console.log(
      'We have userId',
      userId,
      'in url. found user:',
      selectedUser,
      'from a total of ',
      users.length
    );
    return <UserDetails user={selectedUser} />;
  } else {
    return (
      <>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              [...users].map((user) => {
                const user_url = `/users/${user.id}`;
                return (
                  <tr key={user.id}>
                    <td>
                      <Link to={user_url}>{user.name}</Link>
                    </td>
                    <td>{user.blogs.length}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </>
    );
  }
};

export default UserList;
