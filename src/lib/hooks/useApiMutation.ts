import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface ApiMutationOptions<TResponse, TVariables>
  extends UseMutationOptions<TResponse, Error, TVariables> {
  mockResponse?: TResponse;
}

export function useApiMutation<TResponse, TVariables = unknown>(
  mutationFn?: (data: TVariables) => Promise<TResponse>,
  options?: ApiMutationOptions<TResponse, TVariables>,
) {
  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      // Mock 모드
      if (options?.mockResponse !== undefined) {
        return options.mockResponse;
      }

      // API 모드
      if (!mutationFn) {
        throw new Error("mutationFn이 필요합니다");
      }
      return mutationFn(data);
    },
    ...options,
  });
}
