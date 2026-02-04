import instance from "@/lib/instance";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { loginRoute } from "@/api/route";
import { setToken, setTokenType, setUserRole } from "@/utils/local-storage";
import type { ApiResponse, ApiError } from "@/types/api-response";
import type { LoginPayload, LoginResponse } from "@/types/login-types";

const loginApi = async (
  payload: LoginPayload,
): Promise<ApiResponse<LoginResponse>> => {
  const response = await instance.post<ApiResponse<LoginResponse>>(
    loginRoute(),
    payload,
  );
  return response.data;
};

export const useLogin = (
  options?: Omit<
    UseMutationOptions<ApiResponse<LoginResponse>, ApiError, LoginPayload>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: loginApi,
    ...options,
    onSuccess: (...args) => {
      const [data] = args;
      if (data.success && data.data) {
        setToken(data.data.access_token);
        setTokenType(data.data.token_type);
        setUserRole(data.data.role);
      }

      options?.onSuccess?.(...args);
    },
  });
};
