export const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const apiRoutes = {
  auth: {
    login: `${BACKEND_URL}/auth/login`,
    register: `${BACKEND_URL}/auth/register`,
    logout: `${BACKEND_URL}/auth/logout`,
    me: `${BACKEND_URL}/auth/me`,
  },
  chat: {
    send: `${BACKEND_URL}/chat`,
    history: `${BACKEND_URL}/chat/history`,
  },
} as const;
