// globalToken.js
// simple module that maintains a shared token value across the app
// it also keeps the value in localStorage so it survives page reloads

let token = localStorage.getItem('token') || '';

export function getToken() {
  return token;
}

export function setToken(newToken) {
  token = newToken;
  try {
    localStorage.setItem('token', newToken);
  } catch (e) {
    // storage might be unavailable (e.g. in some tests), ignore
  }
}

export function clearToken() {
  token = '';
  try {
    localStorage.removeItem('token');
  } catch (e) {};
}

// for convenience during development expose helpers on window
if (typeof window !== 'undefined') {
  window.getToken = getToken;
  window.setToken = setToken;
  window.clearToken = clearToken;
}
