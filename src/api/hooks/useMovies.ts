import instance from "@/lib/instance";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { moviesRoute, movieRoute } from "@/api/route";
import type { ApiResponse, ApiError } from "@/types/api-response";
import type { PaginatedResult } from "@/types/category-types";
import type { Movie, MovieListParams, MoviePayload } from "@/types/movie-types";

// ── API functions ─────────────────────────────────────────────────────────────

const listMoviesApi = async (
  params: MovieListParams,
): Promise<ApiResponse<PaginatedResult<Movie>>> => {
  const response = await instance.get<ApiResponse<PaginatedResult<Movie>>>(
    moviesRoute(),
    { params },
  );
  return response.data;
};

const getMovieApi = async (id: string): Promise<ApiResponse<Movie>> => {
  const response = await instance.get<ApiResponse<Movie>>(movieRoute(id));
  return response.data;
};

const createMovieApi = async (
  payload: MoviePayload,
): Promise<ApiResponse<Movie>> => {
  const response = await instance.post<ApiResponse<Movie>>(
    moviesRoute(),
    payload,
  );
  return response.data;
};

const updateMovieApi = async ({
  id,
  payload,
}: {
  id: string;
  payload: MoviePayload;
}): Promise<ApiResponse<Movie>> => {
  const response = await instance.put<ApiResponse<Movie>>(
    movieRoute(id),
    payload,
  );
  return response.data;
};

const deleteMovieApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await instance.delete<ApiResponse<null>>(movieRoute(id));
  return response.data;
};

// ── Query keys ────────────────────────────────────────────────────────────────

export const movieKeys = {
  all: ["movies"] as const,
  lists: () => [...movieKeys.all, "list"] as const,
  list: (params: MovieListParams) => [...movieKeys.lists(), params] as const,
  details: () => [...movieKeys.all, "detail"] as const,
  detail: (id: string) => [...movieKeys.details(), id] as const,
};

// ── Hooks ─────────────────────────────────────────────────────────────────────

export const useListMovies = (
  params: MovieListParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<PaginatedResult<Movie>>, ApiError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: movieKeys.list(params),
    queryFn: () => listMoviesApi(params),
    ...options,
  });
};

export const useGetMovie = (
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<Movie>, ApiError>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: movieKeys.detail(id),
    queryFn: () => getMovieApi(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateMovie = (
  options?: Omit<
    UseMutationOptions<ApiResponse<Movie>, ApiError, MoviePayload>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMovieApi,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};

export const useUpdateMovie = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<Movie>,
      ApiError,
      { id: string; payload: MoviePayload }
    >,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMovieApi,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};

export const useDeleteMovie = (
  options?: Omit<
    UseMutationOptions<ApiResponse<null>, ApiError, string>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMovieApi,
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
      options?.onSuccess?.(...args);
    },
  });
};
