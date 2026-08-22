export enum SeatType {
  VIP = "Vip",
  STANDARD = "Thuong",
}

export enum HTTP_STATUS {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER_LOGIN: "userLogin",
} as const;

// How long a seat stays "held" for the current user after they select the
// first seat, before the selection auto-releases — mirrors the hold-timer
// pattern used by most real ticketing platforms (CGV/Ticketbox-style),
// since there's no server-side reservation/lock on the Cybersoft API itself.
export const SEAT_HOLD_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export const API_CONFIG = {
  DOMAIN: process.env.REACT_APP_DOMAIN || "https://movienew.cybersoft.edu.vn/api",
  TOKEN_CYBERSOFT: process.env.REACT_APP_TOKEN_CYBERSOFT || "",
  GROUP_ID: process.env.REACT_APP_GROUP_ID || "GP01",
  TMDB_DOMAIN: process.env.REACT_APP_TMDB_DOMAIN || "https://api.themoviedb.org/3",
  TMDB_API_KEY: process.env.REACT_APP_TMDB_API_KEY || "",
  TMDB_TOKEN: process.env.REACT_APP_TMDB_TOKEN || "",
} as const;
