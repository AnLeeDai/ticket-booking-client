export type UserStatus = "IN_ACTIVE" | "UN_ACTIVE";

export type UserRoleInfo = {
  id?: string;
  name: string;
  slug?: string;
  description?: string | null;
};

export type User = {
  user_id: string;
  id?: string;
  full_name: string;
  user_name: string;
  username?: string;
  email: string;
  phone: string | null;
  dob: string | null;
  address: string | null;
  avatar_url: string | null;
  status: UserStatus;
  role: UserRoleInfo | null;
  created_at: string;
  updated_at: string;
};

export type UserListParams = {
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
};

export type UserUpdatePayload = {
  full_name: string;
  user_name: string;
  phone?: string | null;
  dob?: string | null;
  address?: string | null;
  avatar_url?: string | null;
  status: UserStatus;
};
