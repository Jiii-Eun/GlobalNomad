import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export interface ApiMutationOptions<TResponse, TVariables>
  extends Omit<UseMutationOptions<TResponse, Error, TVariables>, "mutationFn"> {
  mockResponse?: TResponse;
}

export function useApiMutation<TResponse, TVariables = void>(
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
