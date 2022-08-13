import { useSelector, useDispatch } from 'react-redux';
import { voteFor, newQuote } from './reducers/anecdoteReducer';

const App = () => {
  const anecdotes = useSelector(state => state);
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(voteFor(id));
  };

  const createAnecdote = (event) => {
    event.preventDefault();
    const quote = event.target.anecdote.value;
    if (quote.length > 1) {
      event.target.anecdote.value = '';
      dispatch(newQuote(quote));
    }
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={createAnecdote}>
        <div><input name='anecdote' placeholder='new anecdote content here' /></div>
        <button>create</button>
      </form>
    </div>
  );
};

export default App;