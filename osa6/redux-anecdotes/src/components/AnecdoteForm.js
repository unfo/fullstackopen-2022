
import { useDispatch } from 'react-redux';
import { newQuote } from '../reducers/anecdoteReducer';
import { addNotification, clearNotification } from '../reducers/notificationReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const createAnecdote = (event) => {
    event.preventDefault();

    const quote = event.target.anecdote.value;
    if (quote.length > 1) {
      event.target.anecdote.value = '';
      dispatch(newQuote(quote));
      dispatch(addNotification(`New anecdote created: ${quote}`));
      setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
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