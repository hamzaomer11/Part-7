import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog,
      author: newBlogAuthor,
      url: newBlogUrl
    })
    setNewBlog('')
    setNewBlogAuthor('')
    setNewBlogUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            value={newBlog}
            onChange={event => setNewBlog(event.target.value)}
            placeholder='write blog title here'
          />
        </div>
        <div>
          author:
          <input
            value={newBlogAuthor}
            onChange={event => setNewBlogAuthor(event.target.value)}
            placeholder='write blog author here'
          />
        </div>
        <div>
          url:
          <input
            value={newBlogUrl}
            onChange={event => setNewBlogUrl(event.target.value)}
            placeholder='write blog url here'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm