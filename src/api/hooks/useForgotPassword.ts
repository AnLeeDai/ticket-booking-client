import instance from "@/lib/instance";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { forgotPasswordRoute } from "@/api/route";
import type { ApiResponse, ApiError } from "@/types/api-response";
import type {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
} from "@/types/forgot-password-types";

const forgotPasswordApi = async (
  payload: ForgotPasswordPayload,
): Promise<ApiResponse<ForgotPasswordResponse>> => {
  const response = await instance.post<ApiResponse<ForgotPasswordResponse>>(
    forgotPasswordRoute(),
    payload,
  );
  return response.data;
};

export const useForgotPassword = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<ForgotPasswordResponse>,
      ApiError,
      ForgotPasswordPayload
    >,
    "mutationFn"
  >,
) => {
  return useMutation({
    mutationFn: forgotPasswordApi,
    ...options,
  });
};
