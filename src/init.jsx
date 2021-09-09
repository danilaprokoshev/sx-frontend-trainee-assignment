import React from 'react';
import { Provider } from 'react-redux';
import getStoreInstance from './store.js';
import App from './App.jsx';

const init = () => {
  const store = getStoreInstance();

  return (
    <React.StrictMode>
      <Provider store={store}>
        <App/>
      </Provider>
    </React.StrictMode>
  );
};

export default init;
