import { createStore, applyMiddleware, compose } from 'redux';
import { env } from '../environmentSwitch'
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../reducer';

export default function configureStore(initialState) {
  
  if (env == 'dev1' || env == 'dev2') {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return createStore(
      rootReducer,
      composeEnhancers(applyMiddleware(thunkMiddleware)),
      applyMiddleware(thunkMiddleware),
      initialState
    );
  } else {
    return createStore(
      rootReducer,
      applyMiddleware(thunkMiddleware),
      initialState
    );
  }
  

  


};