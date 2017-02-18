import {
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  SET_NEW_PASSWORD_SUCCESS,
  SET_NEW_PASSWORD_ERROR,
} from '../actions/types';

const INITIAL_STATE = {
  new: {
    error: '',
    message: '',
  }
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case RESET_PASSWORD_ERROR:
      return {
        ...state,
        new: {
          error: '',
          message: '',
        },
        message: '',
        error: action.payload,
      }
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        new: {
          error: '',
          message: '',
        },
        error: '',
        message: action.payload,
      }
      case SET_NEW_PASSWORD_ERROR:
        return {
          ...state,
          new: {
            error: action.payload,
            message: '',
          },
          error: '',
          message: '',
        }
      case SET_NEW_PASSWORD_SUCCESS:
        return {
          ...state,
          new: {
            error: '',
            message: action.payload,
          },
          error: '',
          message: '',
      }
    default:
      return state;
  }
}
