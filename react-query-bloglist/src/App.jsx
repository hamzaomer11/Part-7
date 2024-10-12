import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import '../index.css'
import { useNotificationDispatch } from './NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'



const App = () => {
  /* const [blogs, setBlogs] = useState([]) */
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const BlogFormRef = useRef()

  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
      mutationFn: blogService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['blogs'] })
      }
    })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notificationDispatch({
        type: 'SHOW-NOTIFICATION',
        payload: `Wrong username or password. Try again.`
      })
      setTimeout(() =>
        notificationDispatch({
          type: 'HIDE-NOTIFICATION',
          payload: ''
        })
      , 5000)
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addBlog = (blogObject) => {
    BlogFormRef.current.toggleVisibility()
    newBlogMutation.mutate(blogObject)
        notificationDispatch({
          type: 'SHOW-NOTIFICATION',
          payload: `a new blog ${blogObject.title} by ${blogObject.author} added`
        })
        setTimeout(() =>
          notificationDispatch({
            type: 'HIDE-NOTIFICATION',
            payload: ''
          })
        , 5000)
  }

  const updateBlog = (updateObject) => {
    blogService
      .update(updateObject.id, updateObject)
      .then(returnedBlog => {
        console.log(returnedBlog)
        setBlogs(blogs.map(blog => blog.id !== updateObject.id ? blog : updateObject))
      })
  }

  const deleteBlog = (deleteObject) => {
    const ok = window.confirm(`Remove blog ${deleteObject.title} by ${deleteObject.author}?`)
    if (ok) {
      blogService
        .remove(deleteObject.id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== deleteObject.id))
        })
    }
  }

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const blogs = result.data

  const rankByLikes = (a, b) => {
    return b.likes - a.likes;
  }

  if (user === null) {
    return (
      <div>
        <Notification/>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              autoComplete='off'
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification/>
      <p>{user.name} logged-in <button onClick={handleLogOut}>logout</button></p>
      <Togglable buttonLabel="new blog" ref={BlogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      <br />
      {blogs.sort(rankByLikes).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog}
          deleteBlog={deleteBlog} canUserDelete={user.username === blog.user.username} />
      )}
    </div>
  )

}

export default App