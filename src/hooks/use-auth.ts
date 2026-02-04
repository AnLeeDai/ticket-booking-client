import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router";

import {
  getToken,
  getUserRole,
  removeToken,
} from "@/utils/local-storage";
import { pageRoute } from "@/configs/site-config";
import type { UserRole } from "@/types/auth-types";

export function useAuth() {
  const navigate = useNavigate();

  const token = getToken();
  const role = getUserRole() as UserRole | null;

  const isAuthenticated = useMemo(() => !!token, [token]);

  const isAdmin = useMemo(() => role === "admin", [role]);
  const isEmployee = useMemo(() => role === "employee", [role]);
  const isCustomer = useMemo(() => role === "customer", [role]);

  const hasRole = useCallback(
    (allowedRoles: UserRole | UserRole[]) => {
      if (!role) return false;
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      return roles.includes(role);
    },
    [role],
  );

  const logout = useCallback(() => {
    removeToken();
    navigate(pageRoute.login);
  }, [navigate]);

  const redirectToRoleDashboard = useCallback(() => {
    if (!role) {
      navigate(pageRoute.login);
      return;
    }

    switch (role) {
      case "admin":
        navigate(pageRoute.adminDashboard);
        break;
      case "employee":
        navigate(pageRoute.employeeDashboard);
        break;
      case "customer":
        navigate(pageRoute.customerDashboard);
        break;
      default:
        navigate(pageRoute.home);
    }
  }, [role, navigate]);

  return {
    token,
    role,
    isAuthenticated,
    isAdmin,
    isEmployee,
    isCustomer,
    hasRole,
    logout,
    redirectToRoleDashboard,
  };
}
