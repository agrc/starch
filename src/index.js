import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

console.log('REACT_APP_DISCOVER', process.env.REACT_APP_DISCOVER);
console.log('REACT_APP_WEB_API', process.env.REACT_APP_WEB_API);
console.log('REACT_APP_PRINT_PROXY', process.env.REACT_APP_PRINT_PROXY);
console.log('REACT_APP_VERSION', process.env.REACT_APP_VERSION);

ReactDOM.render(<App />, document.getElementById('root'));
