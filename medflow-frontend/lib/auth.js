// src/lib/auth.js
export const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("mf_token", token);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("mf_token");
  }
  return null;
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("mf_token");
  }
};
