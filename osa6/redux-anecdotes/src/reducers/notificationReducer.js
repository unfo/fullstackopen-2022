import { createSlice } from '@reduxjs/toolkit';

const initialState = 'no news is good news';
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {}
});

export default notificationSlice.reducer;