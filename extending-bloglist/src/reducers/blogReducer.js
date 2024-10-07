import { createSlice } from "@reduxjs/toolkit";
import blogService from '../services/blogs'


const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        appendBlog(state, action) {
            state.push(action.payload)
        },
        setBlogs(state, action) {
            return action.payload
        },
        updateBlog(state, action) {
          return state.map(blog =>
            blog.id !== action.payload.id ? blog : action.payload 
          )
        },
        removeBlog(state, action) {
          return action.payload
        }
    }
})
  
export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = newObject => {
    return async dispatch => {
      const newBlog = await blogService.create(newObject)
      dispatch(appendBlog(newBlog))
    }
}

export const updateVote = id => {
  return async (dispatch, getState) => {
      const blogToChange = getState().blogs.find(blog => blog.id === id)
      const changedBlog = { 
        ...blogToChange, 
        likes: blogToChange.likes + 1
      }
    await blogService.update(id, changedBlog)
    dispatch(updateBlog(changedBlog))
  }
}

export const deletingBlog = id => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(initializeBlogs())
  }
}
  
export default blogSlice.reducer