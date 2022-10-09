import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    incrementLikes(state, { payload }) {
      const id = payload;
      const item = state.find((blog) => blog.id === id);
      const changedItem = {
        ...item,
        likes: item.likes + 1,
      };
      return state.map((blog) => (blog.id === id ? changedItem : blog));
    },
    appendBlog(state, { payload }) {
      return [...state, payload];
    },
    removeBlog(state, { payload }) {
      const id = payload;
      return state.filter((blog) => blog.id !== id);
    },
    setBlogs(state, { payload }) {
      return payload;
    },
  },
});

export const { incrementLikes, appendBlog, setBlogs, removeBlog } =
  blogSlice.actions;

export const voteFor = (id) => {
  return async (dispatch) => {
    const all = await blogService.getAll();
    const item = all.find((b) => b.id === id);
    const changedItem = {
      ...item,
      likes: item.likes + 1,
    };
    await blogService.update(id, changedItem);
    dispatch(incrementLikes(id));
  };
};

export const initializeBlogs = () => {
  return async (dispatch) => {
    const all = await blogService.getAll();
    dispatch(setBlogs(all));
  };
};

export const newBlog = (blog) => {
  return async (dispatch) => {
    const newQ = await blogService.create(blog);
    dispatch(appendBlog(newQ));
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog.id);
    dispatch(removeBlog(blog.id));
  };
};

export default blogSlice.reducer;
