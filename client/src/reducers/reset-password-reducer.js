import {
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from '../actions/types';

export default function(state = {}, action) {
  switch(action.type) {
    case RESET_PASSWORD_ERROR:
      return {
        ...state,
        message: '',
        error: action.payload,
      }
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        error: '',
        message: action.payload,
      }
    default:
      return state;
  }
}
