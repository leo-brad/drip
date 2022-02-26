import { createStore, } from 'redux';
import reducer from '~/render/script/reducer';

export default createStore(
  reducer,
);
