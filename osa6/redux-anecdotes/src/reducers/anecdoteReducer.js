import { createSlice } from '@reduxjs/toolkit';
import anecdotesService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteFor(state, action) {
      const id = action.payload.id;
      const item = state.find(quote => quote.id === id);
      const changedItem = {
        ...item,
        votes: item.votes + 1
      };
      return state.map(quote => quote.id === id ? changedItem : quote);
    },
    newQuote(state, { payload }) {
      return [ ...state, payload ];
    },
    setAnecdotes(state, { payload }) {
      console.log('setAnecdotes', payload);
      return payload;
    }
  }
});

export const { voteFor, newQuote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async dispatch => {
    const all = await anecdotesService.getAll();
    dispatch(setAnecdotes(all));
  };
};
export default anecdoteSlice.reducer;