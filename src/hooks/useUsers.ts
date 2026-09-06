import { useCallback, useEffect, useRef, useState } from "react";
import { getAllUsers, type AdminUser } from "@/services/userService";

export interface UseUsersReturn {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  fetchUsers: () => Promise<void>;
  refreshUsers: () => Promise<void>;
}

/**
 * Manages all Users API state.
 * - Fetches once on mount.
 * - Exposes fetchUsers() for retry and refreshUsers() for pull-to-refresh.
 * - Guards against duplicate in-flight requests.
 */
export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInFlightRef = useRef<Promise<void> | null>(null);

  const fetchUsers = useCallback(async () => {
    // Prevent duplicate concurrent requests.
    if (fetchInFlightRef.current) return;

    setLoading(true);
    setError(null);

    const p = (async () => {
      try {
        const { users: fetched } = await getAllUsers();
        setUsers(fetched);
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Unable to load users. Please try again.";
        setError(msg);
      }
    })();

    fetchInFlightRef.current = p;
    try {
      await p;
    } finally {
      fetchInFlightRef.current = null;
      setLoading(false);
    }
  }, []);

  /**
   * Triggered by pull-to-refresh — sets refreshing instead of loading
   * so the native indicator shows instead of the full skeleton.
   */
  const refreshUsers = useCallback(async () => {
    if (fetchInFlightRef.current) return;

    setRefreshing(true);
    setError(null);

    const p = (async () => {
      try {
        const { users: fetched } = await getAllUsers();
        setUsers(fetched);
      } catch (e: unknown) {
        const msg =
          e instanceof Error ? e.message : "Unable to load users. Please try again.";
        setError(msg);
      }
    })();

    fetchInFlightRef.current = p;
    try {
      await p;
    } finally {
      fetchInFlightRef.current = null;
      setRefreshing(false);
    }
  }, []);

  // Fetch once on mount.
  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refreshing, fetchUsers, refreshUsers };
}
