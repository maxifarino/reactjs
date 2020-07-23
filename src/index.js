import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/configureStore';

import { Provider } from 'react-redux';

import {BrowserRouter as Router } from 'react-router-dom';
import getRoutes from './routes';

import './index.css';
import './assets/icons/icons.css';
import './assets/icons/linearicons.css';

import './../node_modules/bootstrap/dist/css/bootstrap.min.css';

const store = configureStore();

ReactDOM.render(
  <Provider store={store} >
    <Router>
      { getRoutes(store) }
    </Router>
  </Provider>,
  document.getElementById('root')
);
