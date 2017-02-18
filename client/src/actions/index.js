import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  SET_NEW_PASSWORD_ERROR,
  SET_NEW_PASSWORD_SUCCESS,
} from './types';

const ROOT_URL = 'http://localhost:3090';

export function signinUser({ email, password }) {
  return function(dispatch) {
    // Submit email/password to the server
    axios.post(`${ROOT_URL}/signin`, { email, password })
      .then((response) => {
        // If request is good...
        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });

        // - Save the JWT token
        localStorage.setItem('token', response.data.token);

        // - redirect to the route '/feature'
        browserHistory.push('/feature');
      })
      .catch(() => {
        // If request is bad...
        // - Show an error to the user
        dispatch(authError('Bad Login Info'));
      });
  }
};

export function signupUser({ email, password }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email, password })
      .then((response) => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/feature');
      })
      .catch(({ response }) => {
        return dispatch(authError(response.data.error));
      });
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error,
  }
};

export function signoutUser() {
  // Get rid of the JWT token
  localStorage.removeItem('token');

  return {
    type: UNAUTH_USER,
  }
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: {
        authorization: localStorage.getItem('token')
      },
    })
      .then((response) => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        })
      });
  }
}

export function sendResetPasswordLink({ email }) {
  return function(dispatch) {
    axios.put(`${ROOT_URL}/reset-password`, { email })
      .then((response) => {
        dispatch({
          type: RESET_PASSWORD_SUCCESS,
          payload: response.data.message,
        });
      })
      .catch(({ response }) => {
        return dispatch({
          type: RESET_PASSWORD_ERROR,
          payload: response.data.error,
        });
      });
  }
}

export function saveNewPassword({ password, resetToken }) {
  return function(dispatch) {
    axios.post(`${ROOT_URL}/reset-password`, { password, resetToken })
      .then((response) => {
        dispatch({
          type: SET_NEW_PASSWORD_SUCCESS,
          payload: response.data.message,
        });
      })
      .catch(({ response }) => {
        return dispatch({
          type: SET_NEW_PASSWORD_ERROR,
          payload: response.data.error,
        });
      });
  }
}
