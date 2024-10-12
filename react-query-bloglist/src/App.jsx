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
import { useUserDispatch, useUserValue } from './UserContext'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const userValue = useUserValue()

  const BlogFormRef = useRef()

  const notificationDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
      mutationFn: blogService.create,
      onSuccess: (newObject) => {
        const blogs = queryClient.getQueryData(['blogs'])
        queryClient.setQueryData(['blogs'], blogs.concat(newObject))
      }
  })

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({
        type: 'SETLOGINSTATE',
        payload: user
      })
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
      userDispatch({
        type: 'SETLOGINSTATE',
        payload: user
      })
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
      'loggedBlogappUser', JSON.stringify(userValue)
    )
    userDispatch({
      type: 'SETLOGINSTATE',
      payload: null
    })
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
    updateBlogMutation.mutate(updateObject)
  }

  const deleteBlog = (deleteObject) => {
    const ok = window.confirm(`Remove blog ${deleteObject.title} by ${deleteObject.author}?`)
    if (ok) {
      deleteBlogMutation.mutate(deleteObject)
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

  if (userValue === null) {
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
      <p>{userValue.name} logged-in <button onClick={handleLogOut}>logout</button></p>
      <Togglable buttonLabel="new blog" ref={BlogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      <br />
      {blogs.sort(rankByLikes).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog}
          deleteBlog={deleteBlog} canUserDelete={userValue.username === blog.user.username} />
      )}
    </div>
  )

}

export default App