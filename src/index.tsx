import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import MyText from './components/my-text/index'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'my-text': any
    }
  }
}

var myText = new MyText();

const App = () => {
  const [text, setText] = useState('xxx');
  const textEl = useRef(null);

  useEffect(() => {
    textEl.current.onchange = () => {
      console.log(1);
    }
  }, []);

  return(
    <div>
      <h1>My App</h1>
      <my-text
        ref={textEl}
        value={text}
      ></my-text>
    </div>
  );
}

window.addEventListener('DOMContentLoaded', (event) => {
  ReactDOM.render(<App />, document.getElementById('root'));
});