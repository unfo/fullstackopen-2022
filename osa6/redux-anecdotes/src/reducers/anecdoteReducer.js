// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ];

// const getId = () => (100000 * Math.random()).toFixed(0);

// action creator
export const voteFor = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  };
};

// action creator
export const newQuote = (quote) => {
  return {
    type: 'CREATE',
    data: quote
  };
};

export const setAnecdotes = (anecdotes) => {
  return  {
    type: 'SET',
    data: anecdotes
  };
};

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   };
// };

// const initialState = anecdotesAtStart.map(asObject);

const anecdoteReducer = (state = [], action) => {
  console.log('anecdoteReducer', action);
  switch(action.type) {
  case 'VOTE': {
    const id = action.data.id;
    const item = state.find(quote => quote.id === id);
    const changedItem = {
      ...item,
      votes: item.votes + 1
    };
    return state.map(quote => quote.id === id ? changedItem : quote);
  }
  case 'CREATE': {
    const quote = action.data;
    return [...state, quote];
  }
  case 'SET': {
    return action.data;
  }
  default:
    return state;
  }
};

export default anecdoteReducer;