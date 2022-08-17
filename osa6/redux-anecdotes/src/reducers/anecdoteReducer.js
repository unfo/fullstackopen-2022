import { createSlice } from '@reduxjs/toolkit';
import anecdotesService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    incrementVotes(state, { payload }) {
      const id = payload;
      const item = state.find(quote => quote.id === id);
      const changedItem = {
        ...item,
        votes: item.votes + 1
      };
      return state.map(quote => quote.id === id ? changedItem : quote);
    },
    appendQuote(state, { payload }) {
      return [ ...state, payload ];
    },
    setAnecdotes(state, { payload }) {
      return payload;
    }
  }
});

export const { incrementVotes, appendQuote, setAnecdotes } = anecdoteSlice.actions;

export const voteFor = (id) => {
  return async dispatch => {
    const item = await anecdotesService.getById(id);
    const changedItem = {
      ...item,
      votes: item.votes + 1
    };
    await anecdotesService.update(id, changedItem);
    dispatch(incrementVotes(id));
  };
};

export const initializeAnecdotes = () => {
  return async dispatch => {
    const all = await anecdotesService.getAll();
    dispatch(setAnecdotes(all));
  };
};

export const newQuote = quote => {
  return async dispatch => {
    const newQ = await anecdotesService.createNew(quote);
    dispatch(appendQuote(newQ));
  };
};

export default anecdoteSlice.reducer;