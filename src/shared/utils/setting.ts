import axios from "axios";
import { createBrowserHistory } from "history";
import { API_CONFIG, STORAGE_KEYS, HTTP_STATUS } from "shared/constants/appConstants";
import { APP_ROUTES } from "shared/constants/routes";

export const DOMAIN: string = API_CONFIG.DOMAIN.endsWith("/api")
  ? API_CONFIG.DOMAIN
  : `${API_CONFIG.DOMAIN}/api`;
export const TokenCybersoft: string = API_CONFIG.TOKEN_CYBERSOFT;
export const ACCESS_TOKEN: string = STORAGE_KEYS.ACCESS_TOKEN;
export const USER_LOGIN: string = STORAGE_KEYS.USER_LOGIN;
export const GROUP_ID: string = API_CONFIG.GROUP_ID;

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
      const jsonString = JSON.stringify(value);
      settings.setCookie(name, encodeURIComponent(jsonString), days);
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
      TokenCybersoft: TokenCybersoft,
      Authorization: token ? `Bearer ${token}` : "",
    };
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    const status = error.response?.status;
    if (status === HTTP_STATUS.UNAUTHORIZED || status === HTTP_STATUS.FORBIDDEN) {
      settings.eraseCookie(ACCESS_TOKEN);
      settings.eraseCookie(USER_LOGIN);
      history.push(APP_ROUTES.LOGIN);
    }
    return Promise.reject(error);
  }
);
