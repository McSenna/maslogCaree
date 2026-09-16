import { useCallback, useEffect, useRef, useState } from "react";
import { getAllUsers, type AdminUser } from "@/features/users/services/userService";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export interface UseUsersReturn {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  fetchUsers: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  applyUserUpdate: (user: AdminUser) => void;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInFlightRef = useRef<Promise<void> | null>(null);

  const fetchUsers = useCallback(async () => {
    if (fetchInFlightRef.current) return;

    setLoading(true);
    setError(null);

    const p = (async () => {
      try {
        const { users: fetched } = await getAllUsers();
        setUsers(fetched);
      } catch (e: unknown) {
        setError(getApiErrorMessage(e, "Unable to load users. Please try again."));
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

  const refreshUsers = useCallback(async () => {
    if (fetchInFlightRef.current) return;

    setRefreshing(true);
    setError(null);

    const p = (async () => {
      try {
        const { users: fetched } = await getAllUsers();
        setUsers(fetched);
      } catch (e: unknown) {
        setError(getApiErrorMessage(e, "Unable to load users. Please try again."));
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

  const applyUserUpdate = useCallback((updated: AdminUser) => {
    setUsers((prev) => prev.map((user) => (user._id === updated._id ? updated : user)));
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refreshing, fetchUsers, refreshUsers, applyUserUpdate };
};
