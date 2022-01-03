import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Routes, Route, } from 'react-router-dom';
import store from '~/script/store';
import Home from '~/script/page/Home';
import "~/style/index.css";

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
