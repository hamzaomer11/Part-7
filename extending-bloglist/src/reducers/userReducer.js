import { createSlice } from "@reduxjs/toolkit";
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from "./notificationReducer";

const initialUserState = {
    username: '',
    password: '',
    user: null
}

const userSlice = createSlice({
    name: 'users',
    initialState: initialUserState,
    reducers: {
        setUser(state, action) {
          return {
            ...state,
            user: action.payload
          }
        },
        setUsername(state, action) {
          return {
            ...state,
            username: action.payload
          }
        },
        setPassword(state, action) {
          return {
            ...state,
            password: action.payload
          }
        }
    }
})

export const {setUser, setUsername, setPassword} = userSlice.actions

export const loginUser = (username, password) => {
    return async dispatch => {
      try {
        const user = await loginService.login({username, password})
        window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
        blogService.setToken(user.token);
        dispatch(setUser(user));
      }
      catch (error) {
        dispatch(setNotification(error.response.data.error, 5));
      }
    } 
}

export default userSlice.reducer