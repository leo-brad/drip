import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Routes, Route, } from 'react-router-dom';
import Home from '~/render/script/page/Home';
import reducer from '~/render/script/reducer';
import { createStore, } from 'redux';
import '~/render/style/index.css';

const store = createStore(
  reducer,
  {
    content: {
      index: { 'plugin1:instance1': 0, 'plugin1:instace2': 1 },
      contents: [[{ instance: 'plugin1:instance1', }], [{ instance: 'plugin1:instance2' }],],
    },
    instance: {
      instance: 'plugin1',
      instances: ['plugin1', 'plugin2' ],
    },
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  </Provider>,
  document.getElementById('root'),
);
