export type LoginPayload = {
  email: string;
  password: string;
  device_name: string;
};

export type LoginResponse = {
  token_type: string;
  access_token: string;
  role: string;
};
