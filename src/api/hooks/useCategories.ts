import instance from "@/lib/instance";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { categoriesRoute, categoryRoute } from "@/api/route";
import type { ApiResponse, ApiError } from "@/types/api-response";
import type {
  Category,
  CategoryListParams,
  CategoryPayload,
  PaginatedResult,
} from "@/types/category-types";

// ── API functions ─────────────────────────────────────────────────────────────

const listCategoriesApi = async (
  params: CategoryListParams,
): Promise<ApiResponse<PaginatedResult<Category>>> => {
  const response = await instance.get<
    ApiResponse<PaginatedResult<Category>>
  >(categoriesRoute(), { params });
  return response.data;
};

const getCategoryApi = async (
  id: string,
): Promise<ApiResponse<Category>> => {
  const response = await instance.get<ApiResponse<Category>>(
    categoryRoute(id),
  );
  return response.data;
};

const createCategoryApi = async (
  payload: CategoryPayload,
): Promise<ApiResponse<Category>> => {
  const response = await instance.post<ApiResponse<Category>>(
    categoriesRoute(),
    payload,
  );
  return response.data;
};

const updateCategoryApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: CategoryPayload;
}): Promise<ApiResponse<Category>> => {
  const response = await instance.put<ApiResponse<Category>>(
    categoryRoute(id),
    payload,
  );
  return response.data;
};

const deleteCategoryApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await instance.delete<ApiResponse<null>>(categoryRoute(id));
  return response.data;
};

// ── Query keys ────────────────────────────────────────────────────────────────

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (params: CategoryListParams) =>
    [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

export const useListCategories = (
  params: CategoryListParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<PaginatedResult<Category>>, ApiError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => listCategoriesApi(params),
    ...options,
  });
};

export const useGetCategory = (
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<Category>, ApiError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryApi(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateCategory = (
  options?: Omit<
    UseMutationOptions<ApiResponse<Category>, ApiError, CategoryPayload>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategoryApi,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateCategory = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Category>,
      ApiError,
      { id: string; payload: CategoryPayload }
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategoryApi,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteCategory = (
  options?: Omit<
    UseMutationOptions<ApiResponse<null>, ApiError, string>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoryApi,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};
