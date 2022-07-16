import axios from "axios";
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  RESET_PASSWORD,
} from "./types";
import { SERVER_API_URL, USER_API } from "../config";
import { deleteAllCookies, setCookie } from "../cookies/cookies";

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${SERVER_API_URL}${USER_API}/register`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function loginUser(dataToSubmit) {
  const request = axios
    .post(`${SERVER_API_URL}${USER_API}/login`, dataToSubmit)
    .then((response) => {
      setCookie("w_authExp", response.data.w_authExp);
      setCookie("w_auth", response.data.w_auth);
      return response.data;
    });

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get(`${SERVER_API_URL}${USER_API}/auth`, { withCredentials: true })
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function logoutUser() {
  const request = axios
    .get(`${SERVER_API_URL}${USER_API}/logout`, {
      headers: {
        "Content-Type": "application/json",
        cookies: document.cookies,
      },
    })

    .then((response) => {
      deleteAllCookies();
      return response.data;
    });

  return {
    type: LOGOUT_USER,
    payload: request,
  };
}

export function resetPassword() {
  const request = axios
    .get(`${SERVER_API_URL}${USER_API}/reset-password`)
    .then((response) => response.data);

  return {
    type: RESET_PASSWORD,
    payload: request,
  };
}
