// Pure list updates for realtime events, shared by useRealtimeCollection and
// useRealtimeItem. Free of React so it runs under `node --test`.

export type CollectionOptions<T> = {
  getId: (item: T) => string;
  /** Whether a record belongs in this view (status tab, filter). A record that stops matching leaves it. */
  accept?: (item: T) => boolean;
  /** Keeps the list in its server order after an insert. Omitted: new records go first. */
  sort?: (a: T, b: T) => number;
};

type Versioned = { updatedAt?: unknown };

const versionOf = (item: unknown): number | null => {
  const raw = (item as Versioned | null)?.updatedAt;
  if (typeof raw !== "string" && !(raw instanceof Date)) return null;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? null : time;
};

/** The id every REST row in this app carries, as `_id` or `id`. */
export const defaultGetId = (item: unknown): string => {
  const row = item as { _id?: unknown; id?: unknown } | null;
  return String(row?._id ?? row?.id ?? "");
};

/**
 * True when `incoming` would not change what is shown: the same version, an
 * older one arriving late, or an identical record. This is how the device that
 * made a change ignores the echo of its own write.
 */
export const isStale = <T,>(current: T | undefined, incoming: T): boolean => {
  if (current === undefined) return false;
  const currentVersion = versionOf(current);
  const incomingVersion = versionOf(incoming);
  if (currentVersion !== null && incomingVersion !== null) return incomingVersion <= currentVersion;
  return JSON.stringify(current) === JSON.stringify(incoming);
};

/** Adds or replaces one record. Returns the same array when nothing changed, so React skips the render. */
export const upsertItem = <T,>(items: T[], incoming: T, options: CollectionOptions<T>): T[] => {
  const id = options.getId(incoming);
  const index = items.findIndex((item) => options.getId(item) === id);
  const belongs = options.accept ? options.accept(incoming) : true;

  if (!belongs) return index === -1 ? items : items.filter((_, position) => position !== index);
  if (index !== -1 && isStale(items[index], incoming)) return items;

  if (index !== -1) {
    const next = [...items];
    next[index] = incoming;
    return options.sort ? next.sort(options.sort) : next;
  }

  const next = [incoming, ...items];
  return options.sort ? next.sort(options.sort) : next;
};

export const removeItem = <T,>(items: T[], id: string, getId: (item: T) => string): T[] =>
  items.some((item) => getId(item) === id) ? items.filter((item) => getId(item) !== id) : items;

/** Replaces rows that `incoming` has a newer copy of; never adds or reorders. For pages deeper than the first. */
export const replaceKnown = <T,>(items: T[], incoming: T[], getId: (item: T) => string): T[] => {
  if (incoming.length === 0) return items;
  const fresh = new Map(incoming.map((item) => [getId(item), item]));
  let changed = false;
  const next = items.map((item) => {
    const update = fresh.get(getId(item));
    if (update === undefined || isStale(item, update)) return item;
    changed = true;
    return update;
  });
  return changed ? next : items;
};

/**
 * A reloaded first page in front of the rows a "load more" list already holds,
 * one entry per id, so a quiet reload never throws away pages the user scrolled to.
 */
export const foldFirstPage = <T,>(items: T[], firstPage: T[], getId: (item: T) => string): T[] => {
  const onFirstPage = new Set(firstPage.map(getId));
  return [...firstPage, ...items.filter((item) => !onFirstPage.has(getId(item)))];
};
