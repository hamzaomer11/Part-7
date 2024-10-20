import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import UserView from './components/UserView'
import User from './components/User'
import blogService from './services/blogs'
import loginService from './services/login'
import axios from 'axios'
import '../index.css'
import { useNotificationDispatch } from './NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUserDispatch, useUserValue } from './UserContext'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import * as Menubar from "@radix-ui/react-menubar";

const Menu = ({userValue, handleLogOut}) => {
  const padding = {
    paddingRight: 5
  }

  const menuDivStyling = {
    paddingLeft: 5,
  }

  return (
    <div style={menuDivStyling}>
      <Menubar.Root className="MenubarRoot">
        <Menubar.Menu>
          <Menubar.Trigger className="MenubarTrigger" asChild>
            <Link style={padding} to="/">blogs</Link>
          </Menubar.Trigger>
          <Menubar.Trigger className="MenubarTrigger" asChild>
            <Link style={padding} to="/users">users</Link>
          </Menubar.Trigger>
          <Menubar.Trigger className="MenubarTrigger" asChild>
            <p>{userValue.name} logged-in <button onClick={handleLogOut}>logout</button></p>
          </Menubar.Trigger>
        </Menubar.Menu>
      </Menubar.Root>
    </div>
  )
}

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState()
  const userValue = useUserValue()

  const BlogFormRef = useRef()

  const notificationDispatch = useNotificationDispatch()
  const userDispatch = useUserDispatch()
  const queryClient = useQueryClient()

  const getUsers = async () => {
    const baseUrl = "/api/users"
    const response = await axios.get(baseUrl)
    const users = response.data
    setUsers(users)
  }

  useEffect(() => {
    getUsers()
  }, [])


  const newBlogMutation = useMutation({
      mutationFn: blogService.create,
      onSuccess: (newObject) => {
        const blogs = queryClient.getQueryData(['blogs'])
        queryClient.setQueryData(['blogs'], blogs.concat(newObject))
      }
  })

  const newCommentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
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

  const addComment = (blogObject) => {
    newCommentMutation.mutate(blogObject)
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

  const blogStyle = {
    border: 'solid',
    paddingLeft: 5,
    marginBottom: 5
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
  } else {
    return (
      <div>
        <Router>
          <Menu userValue={userValue} handleLogOut={handleLogOut}/>
          <Routes>
            <Route path="/users" element={
              <div>
                <h2>blogs</h2> 
                <UserView users={users}/> 
              </div>
            }/>
            <Route path='/' element={
              <div>
                <h2>blogs</h2>
                <Notification/>
                <Togglable buttonLabel="new blog" ref={BlogFormRef}>
                  <BlogForm createBlog={addBlog}/>
                </Togglable>
                <br />
                  {blogs.sort(rankByLikes).map(blog => 
                      <div key={blog.id} style={blogStyle}>
                        <Link to={`/blogs/${blog.id}`}><p>{blog.title}</p></Link>
                      </div>
                  )}
              </div>
            }/>
            <Route path='/users/:id' element={
              <div>
                <h2>blogs</h2>
                <User users={users}/>
              </div>
            }/>
            <Route path='/blogs/:id' element={
              <div>
                <h2>blogs</h2>
                <Blog key={blogs.id} blogs={blogs} updateBlog={updateBlog}
                  deleteBlog={deleteBlog} user={userValue} addComment={addComment}/>
              </div>
            }/>
          </Routes>
        </Router>
      </div>
    )
  }

  

}

export default App