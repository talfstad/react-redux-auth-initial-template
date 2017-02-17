import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import auth from './auth-reducer';
import resetPassword from './reset-password-reducer';

const rootReducer = combineReducers({
  form,
  auth,
  resetPassword,
});

export default rootReducer;
