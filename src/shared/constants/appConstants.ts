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

export const API_CONFIG = {
  DOMAIN: process.env.REACT_APP_DOMAIN || "https://movienew.cybersoft.edu.vn/api",
  TOKEN_CYBERSOFT:
    process.env.REACT_APP_TOKEN_CYBERSOFT ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA1OCIsIkhldEhhblN0cmluZyI6IjExLzA2LzIwMzAiLCJIZXRIYW5UaW1lIjoiMTkwNzQ1Mjc5OSIsIm5iZiI6MTkwNzQ1Mjc5OSwiZXhwIjoxOTA3NDUyNzk5fQ.631rl3EwTQfz6CuufNTJlys36XLVmoxo29kP-F_PDKU",
  GROUP_ID: process.env.REACT_APP_GROUP_ID || "GP01",
} as const;
