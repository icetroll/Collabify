import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import Router from "next/router";
import Cookies from "js-cookie";

import { fetchWrapper } from "helpers";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/profile`;
const userSubject = new BehaviorSubject(
  process.browser &&
    JSON.parse(Cookies.get("user") ? decodeURI(Cookies.get("user")) : "{}")
);

export const userService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  logout,
  login,
  getProfile,
};

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  Cookies.remove("user");
  userSubject.next(null);
  Router.push("/");
}

function login() {
  Router.push("/api/oauth");
}

function getProfile(user_id) {
  return fetchWrapper.get(`${baseUrl}`);
}
