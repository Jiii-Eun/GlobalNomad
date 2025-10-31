import { useMutation, UseMutationOptions, useQueryClient, QueryKey } from "@tanstack/react-query";

import { useErrorHandler } from "@/components/provider/ErrorProvider";

export interface ApiMutationOptions<TResponse, TVariables>
  extends Omit<UseMutationOptions<TResponse, Error, TVariables>, "mutationFn"> {
  mockResponse?: TResponse;
  invalidateQueryKeys?: QueryKey[];
}

export function useApiMutation<TResponse, TVariables = void>(
  mutationFn?: (data: TVariables) => Promise<TResponse>,
  options?: ApiMutationOptions<TResponse, TVariables>,
) {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

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

    onSuccess: async (data, variables, context, mutation) => {
      if (options?.onSuccess) {
        await options.onSuccess(data, variables, context, mutation);
      }

      if (options?.invalidateQueryKeys?.length) {
        await Promise.all(
          options.invalidateQueryKeys.map((key) =>
            queryClient.invalidateQueries({ queryKey: key }),
          ),
        );
      }
    },
    onError: (error, variables, context, mutation) => {
      handleError(error);
      options?.onError?.(error, variables, context, mutation);
    },

    ...options,
  });
}
