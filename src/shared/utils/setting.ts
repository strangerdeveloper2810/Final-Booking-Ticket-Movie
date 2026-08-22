import axios from "axios";
import { createBrowserHistory } from "history";

export const DOMAIN: string = "https://movienew.cybersoft.edu.vn";
export const TokenCybersoft: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA1OCIsIkhldEhhblN0cmluZyI6IjExLzA2LzIwMzAiLCJIZXRIYW5UaW1lIjoiMTkwNzQ1Mjc5OSIsIm5iZiI6MTkwNzQ1Mjc5OSwiZXhwIjoxOTA3NDUyNzk5fQ.631rl3EwTQfz6CuufNTJlys36XLVmoxo29kP-F_PDKU";

export const ACCESS_TOKEN: string = "accessToken";
export const USER_LOGIN: string = "userLogin";
export const GROUP_ID: string = "GP01";

export const history = createBrowserHistory();

export const settings = {
  setCookie: (name: string, value: string, days: number = 30): void => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
  },

  getCookie: (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  setCookieJson: (name: string, value: any, days: number = 30): void => {
    try {
      const jsonValue = JSON.stringify(value);
      settings.setCookie(name, encodeURIComponent(jsonValue), days);
    } catch (error) {
      console.error("Error setting cookie JSON:", error);
    }
  },

  getCookieJson: (name: string): any => {
    try {
      const cookieValue = settings.getCookie(name);
      if (cookieValue) {
        return JSON.parse(decodeURIComponent(cookieValue));
      }
    } catch (error) {
      console.error("Error getting cookie JSON:", error);
    }
    return null;
  },

  eraseCookie: (name: string): void => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  },
};

export const http = axios.create({
  baseURL: DOMAIN,
  timeout: 20000,
});

http.interceptors.request.use(
  (config: any) => {
    const token = settings.getCookie(ACCESS_TOKEN);
    config.headers = {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : "",
      TokenCybersoft,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      settings.eraseCookie(ACCESS_TOKEN);
      settings.eraseCookie(USER_LOGIN);
      if (window.location.pathname !== "/login") {
        history.push("/login");
      }
    }
    return Promise.reject(error);
  }
);
