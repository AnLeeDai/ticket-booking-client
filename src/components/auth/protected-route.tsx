import { Navigate, useLocation } from "react-router";

import { getToken, getUserRole } from "@/utils/local-storage";
import { pageRoute } from "@/configs/site-config";
import type { UserRole } from "@/types/auth-types";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
};

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
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to={pageRoute.login} replace />;
    }
  }

  return <>{children}</>;
}
