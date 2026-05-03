export const API_ENDPOINTS = {
  POSTS: "/api/posts",
  AUTH: "/api/auth",
  AUTH_ME: "/api/auth/me",
  AUTH_LOGOUT: "/api/auth/logout",
  UPLOAD: "/api/upload",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_NEW_POST: "/admin/post/new",
  adminEditPost: (id: string) => `/admin/post/${id}/edit`,
  blogDetail: (slug: string) => `/blog/${slug}`,
} as const;
