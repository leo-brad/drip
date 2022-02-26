import { combineReducers, } from 'redux';
import contentReducer from './contentReducer';
import instanceReducer from './instanceReducer';
import pluginsReducer from './pluginsReducer';

export default combineReducers({
  content: contentReducer,
  instance: instanceReducer,
  plugins: pluginsReducer,
});
