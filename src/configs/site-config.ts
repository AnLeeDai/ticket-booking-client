export const pageRoute = {
  home: "/",
  login: "/auth/login",
  register: "/auth/register",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",

  // Admin routes
  adminDashboard: "/admin",
  categoryManagement: "/admin/categories",
  movieManagement: "/admin/movies",
  userManagement: "/admin/users",

  // Employee routes
  employeeDashboard: "/employee",

  // Customer routes (uses home page)
  customerDashboard: "/",
};

export const adminNavItems = [
  { to: pageRoute.adminDashboard, label: "Dashboard", icon: "LayoutDashboard" as const },
  { to: pageRoute.categoryManagement, label: "Quản lý danh mục", icon: "FolderTree" as const },
  { to: pageRoute.movieManagement, label: "Quản lý phim", icon: "Film" as const },
  { to: pageRoute.userManagement, label: "Quản lý người dùng", icon: "Users" as const },
];