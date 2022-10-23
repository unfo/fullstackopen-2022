import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogService from '../services/blogs';
import { Buffer } from 'buffer';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, { payload }) {
      return payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

// check logged in user + expiry

const isTokenExpired = (token) => {
  const expiry = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
  return expiry.exp * 1000 < Date.now();
};

const getLocalUser = () => {
  const localUser = window.localStorage.getItem('user');
  return localUser ? JSON.parse(localUser) : null;
};

export const restoreStoredLogin = () => {
  return async (dispatch) => {
    const user = getLocalUser();
    const token = user ? user.token : null;
    if (token) {
      if (isTokenExpired(token)) {
        // console.warn('Session expired, logging out');
        dispatch(logout());
      } else {
        // console.log('Session valid, resuming as', user.username);
        dispatch(setUser(user));
        blogService.setToken(token);
      }
    }
  };
};

export const attemptLogin = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({ username, password });
    window.localStorage.setItem('user', JSON.stringify(user));
    dispatch(setUser(user));
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch(clearUser());
    blogService.setToken(null);
    window.localStorage.removeItem('user');
  };
};

export default userSlice.reducer;
