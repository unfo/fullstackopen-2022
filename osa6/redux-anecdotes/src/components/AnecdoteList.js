import { useDispatch, useSelector } from 'react-redux';
import { voteFor } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const filter = useSelector(state => state.filter);
  const anecdotes = useSelector(state => {
    return filter
      ? state.anecdotes.filter(a => a.content.includes(filter))
      : state.anecdotes;
  });

  const vote = (id) => {
    const anecdote = anecdotes.find(a => a.id === id);
    dispatch(voteFor(id));
    dispatch(setNotification(`You voted for ${anecdote.content}`, 5));
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