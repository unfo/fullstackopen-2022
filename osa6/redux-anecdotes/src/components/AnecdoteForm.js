
import { connect } from 'react-redux';
import { newQuote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteForm = (props) => {
  const createAnecdote = async (event) => {
    event.preventDefault();

    const quote = event.target.anecdote.value;
    if (quote.length > 1) {
      event.target.anecdote.value = '';
      props.newQuote(quote);
      props.setNotification(`New anecdote created: ${quote}`, 5);
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

const mapStateToProps = null;
const mapDispatchToProps = {
  newQuote,
  setNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteForm);