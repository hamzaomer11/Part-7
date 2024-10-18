import { useParams } from "react-router-dom"

const Blog = ({ blogs, updateBlog, deleteBlog, user }) => {

  if(!blogs) {
    return null
  }

  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  console.log(blog)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5
  }

  const addLikes = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1
    })
  }

  const removeBlog = () => {
    deleteBlog({
      title: blog.title,
      author: blog.author,
      id: blog.id,
      user: blog.user
    })
  }

  const removeBtn = () => {
    return <button onClick={removeBlog}>remove</button>
  }

  return (
    <div className='blog' style={blogStyle}>
      <div>
        <h2>{blog.title}</h2>
      </div>
      <div>
        {blog.url}
        <br />
        {blog.likes} <button onClick={addLikes}>like</button>
        <br />
        added by {blog.user.username}
        <br />
        {blog.user.username === user.username && (
          removeBtn()
        )}
      </div>
      <div>
        <h3>comments</h3>
      </div>
      <div>
        <ul>
        {blog.comments.map(b => 
          <li key={b.id}>
            {b.content}
          </li>
        )}
        </ul>
      </div>
    </div>
  )
}
export default Blog