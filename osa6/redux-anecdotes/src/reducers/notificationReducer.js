import { createSlice } from '@reduxjs/toolkit';

let timeoutid = null;

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'no news is good news',
  reducers: {
    addNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return '';
    },
  }
});

export const { addNotification, clearNotification } = notificationSlice.actions;

export const setNotification = (message, seconds) => {
  return async dispatch => {
    dispatch(addNotification(message));
    if (timeoutid) {
      console.log('clearing previous timeout', timeoutid);
      clearTimeout(timeoutid);
    }
    timeoutid = setTimeout(() => dispatch(clearNotification()), seconds * 1000);
  };
};

export default notificationSlice.reducer;