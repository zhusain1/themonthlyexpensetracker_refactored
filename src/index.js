import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './Global/global.css';

ReactDOM.render(
  <React.StrictMode>
    <React.Fragment>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </React.Fragment>
  </React.StrictMode>,
  document.getElementById('root')
);

