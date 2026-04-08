import { queryOptions, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { api, ApiError } from "../lib/api";

export function currentProfileOptions(userId?: string) {
  return queryOptions({
    queryKey: ["current-profile", userId ?? "guest"],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) {
        return null;
      }

      try {
        return await api.getProfile(userId);
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

export function useCurrentProfile() {
  const { user } = useAuth();

  return useQuery(currentProfileOptions(user?.id));
}
