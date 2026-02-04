export type RegisterPayload = {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  password_confirmation: string;
  device_name: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  role_id: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  role: Role;
};

export type RegisterResponse = {
  user: User;
  email_sent: boolean;
};
