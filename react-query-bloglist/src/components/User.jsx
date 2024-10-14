import { useParams } from "react-router-dom"

const User = ({users}) => {

    if(!users) {
      return null
    }

    const id = useParams().id
    const user = users.find(u => u.id === id)
  
    return (
        <div>
            <strong>{user.name}</strong>
                <h2>added blogs</h2>
                {user && (
                    <ul>
                        {user.blogs.map(blog => 
                            <li key={blog.id}>
                                {blog.title}
                            </li>
                        )}
                    </ul>
                )}
        </div>
    )
}
  
  export default User