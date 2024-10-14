import { Link } from "react-router-dom"

const UserView = ({users}) => {

  if(!users) {
    return null
  }

    return (
        <div>
            <h2>Users</h2>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Blogs created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                    </td>
                    <td>{user.blogs.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
    )
}

export default UserView