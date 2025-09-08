// hooks/useApi.ts
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import apiClient from "../api/client";

// Generic response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

// Paginated response type matching your API structure
export interface PaginatedResponse<T> {
  page_number: number;
  page_size: number;
  total_count: number;
  data: T[];
}

// Full API response with pagination
export type ApiPaginatedResponse<T> = ApiResponse<PaginatedResponse<T>>;

// Error response type
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  response?: {
    data?: {
      message?: string;
      status?: number;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  [key: string]: any; // Allow other query params
}

// Simplify QueryKey typing
type QueryKey = (string | Record<string, any>)[];

// Hook options (align with v5 signature)
interface UseApiOptions<TQueryFnData, TData = TQueryFnData>
  extends Omit<
    UseQueryOptions<TQueryFnData, ApiError, TData, QueryKey>,
    "queryKey" | "queryFn"
  > {}

// Main API hook
export const useApi = () => {
  const queryClient = useQueryClient();

  // Generic GET request
  const useGet = <T>(
    key: QueryKey,
    url: string,
    options?: UseApiOptions<T>
  ) => {
    return useQuery<T, ApiError, T, QueryKey>({
      queryKey: key,
      queryFn: async () => {
        const response = await apiClient.get<T>(url);
        return response.data;
      },
      ...options,
    });
  };

  // Generic GET request for paginated data
  const useGetPaginated = <T>(
    key: QueryKey,
    url: string,
    params: PaginationParams = {},
    options?: UseApiOptions<ApiPaginatedResponse<T>>
  ) => {
    const { page = 1, limit = 25, ...restParams } = params;

    return useQuery<
      ApiPaginatedResponse<T>,
      ApiError,
      ApiPaginatedResponse<T>,
      QueryKey
    >({
      queryKey: [...key, { page, limit, ...restParams }],
      queryFn: async () => {
        const response = await apiClient.get<ApiPaginatedResponse<T>>(url, {
          params: { page, limit, ...restParams },
        });
        return response.data;
      },
      placeholderData: keepPreviousData,
      ...options,
    });
  };

  // Infinite query for paginated data (load more functionality)
  const useInfinitePaginated = <T>(
    key: QueryKey,
    url: string,
    params: Omit<PaginationParams, "page"> = {},
    options?: Omit<
      UseInfiniteQueryOptions<
        ApiPaginatedResponse<T>,
        ApiError,
        {
          pages: ApiPaginatedResponse<T>[];
          pageParams: number[];
        },
        QueryKey,
        number
      >,
      "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
    >
  ) => {
    return useInfiniteQuery({
      queryKey: [...key, params],
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const response = await apiClient.get<ApiPaginatedResponse<T>>(url, {
          params: { page: pageParam, ...params },
        });
        return response.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page_number, page_size, total_count } = lastPage.data;
        const totalPages = Math.ceil(total_count / page_size);
        return page_number < totalPages ? page_number + 1 : undefined;
      },
      getPreviousPageParam: (firstPage) =>
        firstPage.data.page_number > 1
          ? firstPage.data.page_number - 1
          : undefined,
      ...options,
    });
  };

  // Generic POST request
  const usePost = <TData, TVariables = unknown>(url: string) => {
    return useMutation<TData, ApiError, TVariables>({
      mutationFn: async (data: TVariables) => {
        const response = await apiClient.post<TData>(url, data);
        return response.data;
      },
      onSuccess: () => {
        const resource = url.split("/")[1];
        queryClient.invalidateQueries({ queryKey: [resource] });
      },
    });
  };

  // Generic PUT request
  const usePut = <TData, TVariables = unknown>(url: string) => {
    return useMutation<TData, ApiError, TVariables>({
      mutationFn: async (data: TVariables) => {
        const response = await apiClient.put<TData>(url, data);
        return response.data;
      },
      onSuccess: () => {
        const resource = url.split("/")[1];
        queryClient.invalidateQueries({ queryKey: [resource] });
      },
    });
  };

  // Generic PATCH request
  const usePatch = <TData, TVariables = unknown>(url: string) => {
    return useMutation<TData, ApiError, TVariables>({
      mutationFn: async (data: TVariables) => {
        const response = await apiClient.patch<TData>(url, data);
        return response.data;
      },
      onSuccess: () => {
        const resource = url.split("/")[1];
        queryClient.invalidateQueries({ queryKey: [resource] });
      },
    });
  };

  // Generic DELETE request
  const useDelete = <TData>(url: string) => {
    return useMutation<TData, ApiError, void>({
      mutationFn: async () => {
        const response = await apiClient.delete<TData>(url);
        return response.data;
      },
      onSuccess: () => {
        const resource = url.split("/")[1];
        queryClient.invalidateQueries({ queryKey: [resource] });
      },
    });
  };

  const useDynamicDelete = <TData>() => {
    return useMutation<TData, ApiError, string>({
      // Accept URL string as parameter
      mutationFn: async (url: string) => {
        const response = await apiClient.delete<TData>(url);
        return response.data;
      },
      onSuccess: (_, url) => {
        const resource = url.split("/")[1];
        queryClient.invalidateQueries({ queryKey: [resource] });
      },
    });
  };

  return {
    useGet,
    useGetPaginated,
    useInfinitePaginated,
    usePost,
    usePut,
    usePatch,
    useDelete,
    useDynamicDelete,
  };
};
