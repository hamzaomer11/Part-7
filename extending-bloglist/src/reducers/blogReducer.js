import { createSlice } from "@reduxjs/toolkit";
import blogService from '../services/blogs'


const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        }
    }
  })
  
  export const { setBlogs } = blogSlice.actions

  export const initializeBlogs = () => {
    return async dispatch => {
      const blogs = await blogService.getAll()
      console.log(blogs, 'getting blogs from server')
      dispatch(setBlogs(blogs))
    }
  }
  
  export default blogSlice.reducer