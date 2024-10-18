import { useState } from "react"
import { useParams } from "react-router-dom"

const Blog = ({ blogs, updateBlog, deleteBlog, user, addComment }) => {

  const [addNewComment, setNewComment] = useState('')

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

  const newComment = (event) => {
    event.preventDefault()
    addComment({
      ...blog,
      content: addNewComment 
    })
    setNewComment('')
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
      <form onSubmit={newComment}>
        <div>
          <input
            value={addNewComment}
            onChange={event => setNewComment(event.target.value)}
            placeholder='add new comment'
          />
          <button type="submit" >add comment</button>
        </div>
      </form>
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