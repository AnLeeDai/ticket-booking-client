import instance from "@/lib/instance";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { resetPasswordRoute } from "@/api/route";
import type { ApiResponse, ApiError } from "@/types/api-response";
import type {
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "@/types/reset-password-types";

const resetPasswordApi = async (
  payload: ResetPasswordPayload,
): Promise<ApiResponse<ResetPasswordResponse>> => {
  const response = await instance.post<ApiResponse<ResetPasswordResponse>>(
    resetPasswordRoute(),
    payload,
  );
  return response.data;
};

export const useResetPassword = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ResetPasswordResponse>,
      ApiError,
      ResetPasswordPayload
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: resetPasswordApi,
    ...options,
  });
};
