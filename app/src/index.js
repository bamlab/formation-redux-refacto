// @flow
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import './index.css';

import createStore from './stores';

const store = createStore();

export default class Main extends React.PureComponent<{}> {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

const element = document.getElementById('root');
if (element) {
  ReactDom.render(<Main />, element);
}
