import { Navigate, useLocation } from "react-router";

import { getToken, getUserRole } from "@/utils/local-storage";
import { pageRoute } from "@/configs/site-config";
import type { UserRole } from "@/types/auth-types";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
};

const roleHierarchy: Record<UserRole, number> = {
  admin: 3,
  employee: 2,
  customer: 1,
};

function hasAccess(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  const userLevel = roleHierarchy[userRole];

  const minRequiredLevel = Math.min(
    ...allowedRoles.map((role) => roleHierarchy[role]),
  );

  return userLevel >= minRequiredLevel;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const token = getToken();
  const role = getUserRole() as UserRole | null;

  if (!token) {
    return <Navigate to={pageRoute.login} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !hasAccess(role, allowedRoles)) {
      return <Navigate to={pageRoute.login} replace />;
    }
  }

  return <>{children}</>;
}
