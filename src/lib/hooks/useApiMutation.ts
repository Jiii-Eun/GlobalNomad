import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { apiRequest } from "@/lib/apiRequest";

interface ApiMutationOptions<TResponse, TVariables>
  extends UseMutationOptions<TResponse, Error, TVariables> {
  mockResponse?: TResponse;
}

export function useApiMutation<TResponse, TVariables = unknown>(
  endpoint: string | null,
  method?: "POST" | "PATCH" | "DELETE",
  options?: ApiMutationOptions<TResponse, TVariables>,
) {
  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      if (endpoint === null) {
        if (options?.mockResponse === undefined) {
          throw new Error("mock 모드에는 mockResponse가 필요합니다");
        }
        return options.mockResponse;
      }
      if (!method) {
        throw new Error("API 모드에서는 method가 필요합니다");
      }
      return apiRequest<TResponse>(endpoint, {
        method,
        data,
        isFormData: data instanceof FormData,
      });
    },
    ...options,
  });
}
