import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { subscribeToLogout } from "@/services/authEvents";
import { reportError } from "@/utils/errorReporting";

/*
 * Where a paged list's view survives outside the route.
 *
 * Views (page, size, sort, filters, as query values): on Android and iOS there
 * is no address bar, so the last view of each list is kept in SecureStore and
 * read back before the first screen renders. On the web the URL alone is the
 * view, so nothing is kept here.
 *
 * Search text may hold a resident's name, so it never goes in a URL or onto a
 * phone's disk: it lives for the browser tab (sessionStorage) or for the app
 * session (memory). Signing out clears both, for shared health center tablets.
 */

type SavedParams = Record<string, string>;

const VIEWS_KEY = "maslogcare_list_views";
const SEARCH_PREFIX = "maslogcare_list_search:";
const IS_WEB = Platform.OS === "web";

let views: Record<string, SavedParams> = {};
const memorySearch = new Map<string, string>();

const session = (): Storage | null => {
  try {
    return IS_WEB && typeof sessionStorage !== "undefined" ? sessionStorage : null;
  } catch {
    return null;
  }
};

/** Native only; called with the session restore at start-up so screens never wait on it. */
export const hydrateListViews = async (): Promise<void> => {
  if (IS_WEB) return;
  try {
    const raw = await SecureStore.getItemAsync(VIEWS_KEY);
    views = raw ? (JSON.parse(raw) as Record<string, SavedParams>) : {};
  } catch (error: unknown) {
    reportError("Saved list views not read", error);
    views = {};
  }
};

export const getSavedView = (listKey: string): SavedParams | null => (IS_WEB ? null : (views[listKey] ?? null));

export const saveView = (listKey: string, params: Record<string, string | undefined>): void => {
  if (IS_WEB) return;
  const kept = Object.fromEntries(Object.entries(params).filter((entry): entry is [string, string] => entry[1] !== undefined));
  const next = { ...views };
  if (Object.keys(kept).length === 0) delete next[listKey];
  else next[listKey] = kept;
  views = next;
  void SecureStore.setItemAsync(VIEWS_KEY, JSON.stringify(next)).catch((error: unknown) => reportError("List view not saved", error));
};

export const getSavedSearch = (listKey: string): string => {
  const store = session();
  try {
    return (store ? store.getItem(SEARCH_PREFIX + listKey) : memorySearch.get(listKey)) ?? "";
  } catch {
    return "";
  }
};

export const saveSearch = (listKey: string, search: string): void => {
  const store = session();
  try {
    if (store) {
      if (search) store.setItem(SEARCH_PREFIX + listKey, search);
      else store.removeItem(SEARCH_PREFIX + listKey);
    } else if (search) memorySearch.set(listKey, search);
    else memorySearch.delete(listKey);
  } catch (error: unknown) {
    reportError("List search not kept", error);
  }
};

const clearAll = () => {
  views = {};
  memorySearch.clear();
  const store = session();
  try {
    if (store) {
      Object.keys(store)
        .filter((key) => key.startsWith(SEARCH_PREFIX))
        .forEach((key) => store.removeItem(key));
    }
  } catch {
    // Storage blocked: nothing was kept there either.
  }
  if (!IS_WEB) void SecureStore.deleteItemAsync(VIEWS_KEY).catch((error: unknown) => reportError("List views not cleared", error));
};

subscribeToLogout(clearAll);
