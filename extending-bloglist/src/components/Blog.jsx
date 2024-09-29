import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, canUserDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
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
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} <button onClick={toggleVisibility}>hide</button>
        <br />
        {blog.url}
        <br />
        {blog.likes} <button onClick={addLikes}>like</button>
        <br />
        {blog.author}
        <br />
        {canUserDelete &&
        removeBtn()}
      </div>
    </div>
  )}
export default Blog