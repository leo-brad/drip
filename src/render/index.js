import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Routes, Route, } from 'react-router-dom';
import store from '~/render/script/store';
import Home from '~/render/script/page/Home';
import '~/render/style/index.css';
import Communication from '~/render/script/class/Communication';

new Communication({ store, }).start();
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
