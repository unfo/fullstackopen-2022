/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Link,
  useMatch,
  generatePath,
  useNavigate,
} from 'react-router-dom';

import { useField } from './hooks';

const anecdotePath = '/anecdotes/:id';

const Menu = () => {
  const padding = {
    paddingRight: 5
  };
  return (
    <div>
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/new">create new</Link>
      <Link style={padding} to="/about">about</Link>
    </div>
  );
};

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id} >
          <Link to={generatePath(anecdotePath, { id: anecdote.id })}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
);

const Anecdote = ({ anecdote }) => (
  <>
    <h2>{anecdote.content} by {anecdote.author}</h2>
    <p>has {anecdote.votes} vote(s)</p>
    <p>c.f. <a href={anecdote.info}>{anecdote.info}</a></p>
  </>
);

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
);

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
);

const CreateNew = (props) => {
  const { 'reset': content_reset, ...content } = useField('text');
  const { 'reset': author_reset, ...author } = useField('text');
  const { 'reset': info_reset, ...info } = useField('text');

  const handleReset = () => {
    content_reset();
    author_reset();
    info_reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    });
  };



  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div>
          content
          <input { ...content }/>
        </div>
        <div>
          author
          <input { ...author } />
        </div>
        <div>
          url for more info
          <input { ...info } />
        </div>
        <button>create</button>
        <input type='reset' value='reset' />
      </form>
    </div>
  );

};

const Notification = ({ notification }) => {
  if (notification) {
    return (
      <div className='notification' style={{ backgroundColor: 'orange' }}>{notification}</div>
    );
  }
};

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ]);

  const navigate = useNavigate();
  const [notification, setNotification] = useState('');
  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification('');
      }, 5000);
    }
  }, [notification]);

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
    setNotification(`++ ${anecdote.content} ++`);
    navigate('/');
  };

  const anecdoteById = (id) => anecdotes.find(a => a.id === id);

  const match = useMatch(anecdotePath);
  const anecdote = match
    ? anecdoteById(Number(match.params.id))
    : null;

  // eslint-disable-next-line no-unused-vars
  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    };

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a));
  };

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification notification={notification} />
      <Routes>
        <Route path={anecdotePath} element={<Anecdote anecdote={anecdote} />} />
        <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path='/about' element={<About />} />
        <Route path='/new' element={<CreateNew addNew={addNew} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
