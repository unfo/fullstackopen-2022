import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import { setInfoMessage } from './notificationReducer';

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
    appendComment(state, { payload }) {
      const { id, comment } = payload;
      const item = state.find((blog) => blog.id === id);
      const changedItem = {
        ...item,
        comments: item.comments.concat(comment),
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

export const {
  incrementLikes,
  appendBlog,
  setBlogs,
  removeBlog,
  appendComment,
} = blogSlice.actions;

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
    dispatch(
      setInfoMessage(
        `New blog added [${newQ.title}] by [${newQ.author} // ${newQ.id}]`
      )
    );
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog.id);
    dispatch(removeBlog(blog.id));
  };
};

export const addComment = (blog, comment) => {
  return async (dispatch) => {
    const id = blog.id;
    await blogService.addComment(id, comment);
    dispatch(appendComment({ id, comment }));
  };
};
export default blogSlice.reducer;
