import { createSlice } from "@reduxjs/toolkit"

const initialState = null;

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotificationMessage(state, action) {
            console.log(action.payload)
            return action.payload
        },
        clearNotification(state, action) {
            return null
        }
    }
})

export const {setNotificationMessage, clearNotification} = notificationSlice.actions
export default notificationSlice.reducer

export const setNotification = (text, time) => {
    return async dispatch => {
        setTimeout(() => {
            dispatch(clearNotification())
        }, time * 1000)
        dispatch(setNotificationMessage(text))
    }
}