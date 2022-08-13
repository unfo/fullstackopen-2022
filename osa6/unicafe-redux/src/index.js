import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import reducer from './reducer';

const store = createStore(reducer);

const App = () => {

  const dispatcher = (event) => {
    const value = event.target.value;
    store.dispatch({
      type: value
    });
  };

  return (
    <div>
      <button value='GOOD'  onClick={dispatcher}>good</button>
      <button value='OK'    onClick={dispatcher}>ok</button>
      <button value='BAD'   onClick={dispatcher}>bad</button>
      <button value='ZERO'  onClick={dispatcher}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
const renderApp = () => {
  root.render(<App />);
};

renderApp();
store.subscribe(renderApp);
