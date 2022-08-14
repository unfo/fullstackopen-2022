import { useDispatch, useSelector } from 'react-redux';
import { voteFor } from '../reducers/anecdoteReducer';
import { addNotification, clearNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(state => state.anecdotes);

  const vote = (id) => {
    const anecdote = anecdotes.find(a => a.id === id);
    dispatch(voteFor(id));
    dispatch(addNotification(`You voted for ${anecdote.content}`));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);

  };

  return (
    <>
      {[...anecdotes].sort((a,b) => b.votes - a.votes).map(anecdote =>
        <div key={anecdote.id}>
          <blockquote>
            {anecdote.id}: {anecdote.content}
          </blockquote>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AnecdoteList;