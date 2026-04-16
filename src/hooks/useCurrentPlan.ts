import {queryOptions, useQuery} from "@tanstack/react-query";
import {useAuth} from "../context/AuthContext";
import {api, ApiError} from "../lib/api";

export function currentPlanOptions(userId?: string) {
  return queryOptions({
    queryKey: ["current-plan", userId ?? "guest"],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      try {
        return await api.getCurrentPlan();
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      }
    },
    retry: (failureCount: number, error: Error) => {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }

      return failureCount < 2;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCurrentPlan() {
  const {user} = useAuth();

  return useQuery(currentPlanOptions(user?.id));
}
