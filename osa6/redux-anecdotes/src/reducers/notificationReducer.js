import { createSlice } from '@reduxjs/toolkit';


const initialState = 'no news is good news';
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return '';
    }
  }
});

export const { addNotification, clearNotification } = notificationSlice.actions;

export const setNotification = (message, seconds) => {
  return async dispatch => {
    dispatch(addNotification(message));
    setTimeout(() => dispatch(clearNotification()), seconds * 1000);
  };
};

export default notificationSlice.reducer;