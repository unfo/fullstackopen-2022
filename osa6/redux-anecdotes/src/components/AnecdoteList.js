import { useDispatch, useSelector } from 'react-redux';
import { voteFor } from '../reducers/anecdoteReducer';

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(state => state).sort((a,b) => b.votes - a.votes);

  const vote = (id) => {
    dispatch(voteFor(id));
  };

  return (
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <blockquote>
            {anecdote.content}
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