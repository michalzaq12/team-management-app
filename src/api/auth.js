import decode from 'jwt-decode';

const TOKEN_KEY = 'token';

function getPayload(token){
  token = token || getToken();
  return decode(token);
}

function getToken () {
  return window.localStorage.getItem(TOKEN_KEY)
}

function saveToken (token) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

function destroyToken () {
  window.localStorage.removeItem(TOKEN_KEY)
}

function hasToken() {
  return window.localStorage.getItem(TOKEN_KEY) !== null;
}


export default {
  getPayload,
  getToken,
  saveToken,
  destroyToken,
  hasToken
}
