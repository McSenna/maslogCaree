import { useSyncExternalStore } from "react";

/**
 * A counter every Users screen query reads. Bumping it after a mutation makes
 * the summary, the user list and the request list refetch together, the job
 * a query-cache invalidation would do.
 */
let version = 0;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const read = () => version;

export const invalidateUsers = () => {
  version += 1;
  listeners.forEach((listener) => listener());
};

export const useUsersVersion = () => useSyncExternalStore(subscribe, read, read);
