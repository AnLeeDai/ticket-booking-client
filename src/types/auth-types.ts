export type UserRole = "admin" | "manager" | "employee" | "customer";

export const ROLES = {
  ADMIN: "admin" as UserRole,
  MANAGER: "manager" as UserRole,
  EMPLOYEE: "employee" as UserRole,
  CUSTOMER: "customer" as UserRole,
} as const;
