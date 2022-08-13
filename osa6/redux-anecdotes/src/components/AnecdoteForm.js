
import { useDispatch } from 'react-redux';
import { newQuote } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const createAnecdote = (event) => {
    event.preventDefault();

    console.log(event);
    const quote = event.target.anecdote.value;
    if (quote.length > 1) {
      event.target.anecdote.value = '';
      dispatch(newQuote(quote));
    }
  };
  return (

    <form onSubmit={createAnecdote}>
      <fieldset>
        <legend>Create new</legend>
        <input name='anecdote' placeholder='new anecdote content here' />
        <button>create</button>
      </fieldset>
    </form>
  );
};

export default AnecdoteForm;