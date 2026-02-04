export type UserRole = "admin" | "employee" | "customer";

export const ROLES = {
  ADMIN: "admin" as UserRole,
  EMPLOYEE: "employee" as UserRole,
  CUSTOMER: "customer" as UserRole,
} as const;
