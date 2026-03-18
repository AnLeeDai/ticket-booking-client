import instance from "@/lib/instance";
import {
	useQuery,
	useMutation,
	useQueryClient,
	type UseQueryOptions,
	type UseMutationOptions,
} from "@tanstack/react-query";

import { usersRoute, userRoute } from "@/api/route";
import type { ApiResponse, ApiError } from "@/types/api-response";
import type { PaginatedResult } from "@/types/category-types";
import type {
	User,
	UserListParams,
	UserUpdatePayload,
} from "@/types/user-types";

const listUsersApi = async (
	params: UserListParams,
): Promise<ApiResponse<PaginatedResult<User>>> => {
	const response = await instance.get<ApiResponse<PaginatedResult<User>>>(
		usersRoute(),
		{ params },
	);
	return response.data;
};

const updateUserApi = async ({
	userId,
	payload,
}: {
	userId: string;
	payload: UserUpdatePayload;
}): Promise<ApiResponse<User>> => {
	const response = await instance.put<ApiResponse<User>>(
		userRoute(userId),
		payload,
	);
	return response.data;
};

const deleteUserApi = async (userId: string): Promise<ApiResponse<null>> => {
	const response = await instance.delete<ApiResponse<null>>(userRoute(userId));
	return response.data;
};

export const userKeys = {
	all: ["users"] as const,
	lists: () => [...userKeys.all, "list"] as const,
	list: (params: UserListParams) => [...userKeys.lists(), params] as const,
};

export const useListUsers = (
	params: UserListParams,
	options?: Omit<
		UseQueryOptions<ApiResponse<PaginatedResult<User>>, ApiError>,
		"queryKey" | "queryFn"
	>,
) => {
	return useQuery({
		queryKey: userKeys.list(params),
		queryFn: () => listUsersApi(params),
		...options,
	});
};

export const useUpdateUser = (
	options?: Omit<
		UseMutationOptions<
			ApiResponse<User>,
			ApiError,
				{ userId: string; payload: UserUpdatePayload }
		>,
		"mutationFn"
	>,
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateUserApi,
		...options,
		onSuccess: (...args) => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			options?.onSuccess?.(...args);
		},
	});
};

export const useDeleteUser = (
	options?: Omit<
		UseMutationOptions<ApiResponse<null>, ApiError, string>,
		"mutationFn"
	>,
) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteUserApi,
		...options,
		onSuccess: (...args) => {
			queryClient.invalidateQueries({ queryKey: userKeys.lists() });
			options?.onSuccess?.(...args);
		},
	});
};
