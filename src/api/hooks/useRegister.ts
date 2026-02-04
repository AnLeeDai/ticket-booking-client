import instance from "@/lib/instance";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { registerRoute } from "@/api/route";
import type { ApiResponse, ApiError } from "@/types/api-response";
import type { RegisterPayload, RegisterResponse } from "@/types/register-types";

const registerApi = async (
  payload: RegisterPayload,
): Promise<ApiResponse<RegisterResponse>> => {
  const response = await instance.post<ApiResponse<RegisterResponse>>(
    registerRoute(),
    payload,
  );
  return response.data;
};

export const useRegister = (
  options?: Omit<
    UseMutationOptions<ApiResponse<RegisterResponse>, ApiError, RegisterPayload>,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: registerApi,
    ...options,
  });
};
