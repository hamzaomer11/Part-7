import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "../index.css";

import {setNotification} from './reducers/notificationReducer'
import { useDispatch, useSelector } from "react-redux";

import { initializeBlogs, createBlog, updateVote, deletingBlog } from "./reducers/blogReducer";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const BlogFormRef = useRef();

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(setNotification("Wrong Username or Password", 5));
    }
  };

  const handleLogOut = () => {
    window.localStorage.removeItem("loggedBlogappUser", JSON.stringify(user));
    setUser(null);
    setUsername("");
    setPassword("");
  };

  const addBlog = (blogObject) => {
    BlogFormRef.current.toggleVisibility();
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`, 5))
  };

  const updateBlog = (updateObject) => {
    dispatch(updateVote(updateObject.id))
  };

  const deleteBlog = (deleteObject) => {
    const ok = window.confirm(
      `Remove blog ${deleteObject.title} by ${deleteObject.author}?`,
    );
    if (ok) {
      dispatch(deletingBlog(deleteObject.id))
    }
  };

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
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification/>
      <p>
        {user.name} logged-in <button onClick={handleLogOut}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={BlogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <br />
      {[...blogs].sort(rankByLikes).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          canUserDelete={user.username === blog.user.username}
        />
      ))}
    </div>
  );
};

export default App;
