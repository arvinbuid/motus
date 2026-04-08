import { queryOptions, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";

export function currentPlanOptions(userId?: string) {
  return queryOptions({
    queryKey: ["current-plan", userId ?? "guest"],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      try {
        return await api.getCurrentPlan(userId);
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
  });
}

export function useCurrentPlan() {
  const { user } = useAuth();

  return useQuery(currentPlanOptions(user?.id));
}
