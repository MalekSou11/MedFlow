// src/lib/authEvents.js
export const emitLogin = () => {
  window.dispatchEvent(new Event("login"));
};

export const emitLogout = () => {
  window.dispatchEvent(new Event("logout"));
};
