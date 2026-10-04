/**
 * The persisted view of a paged list (page, page size, sort and filters) as
 * query-string values, and back. Every restored value is sanitized: a missing,
 * hand-edited or stale value falls back to its default instead of reaching the
 * API. Free of React so `node --test` can load it.
 *
 * Never describe a search box or a record ID here: these values end up in the
 * URL, and names or record IDs must not (CLAUDE.md, RA 10173).
 */

export type FieldSpec =
  | { kind: "enum"; values: readonly string[]; fallback: string; param?: string }
  | { kind: "date"; param?: string }
  /** A short identifier from the server (a service key), when the list of values is not known up front. */
  | { kind: "code"; param?: string };

export type ListSchema<F extends Record<string, string>> = {
  fields: { [K in keyof F]: FieldSpec };
  /** Page sizes the list offers; the first is the default. */
  limits: readonly number[];
  /** Query name for the page when two lists share a route (the Users screen's Masterlist tab). Default "page". */
  pageParam?: string;
};

export type ListView<F extends Record<string, string>> = { page: number; limit: number; filters: F };

export type RawParams = Record<string, string | string[] | undefined>;

const LIMIT = "limit";
const pageParamOf = (schema: { pageParam?: string }) => schema.pageParam ?? "page";
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const CODE = /^[a-z0-9_-]{1,40}$/i;

const first = (value: string | string[] | undefined): string | undefined => (Array.isArray(value) ? value[0] : value);

const paramOf = (key: string, spec: FieldSpec) => spec.param ?? key;

/** A whole number of at least 1; "0", "-2", "2.5", "abc" and "" all mean page 1. */
export const parsePage = (raw: string | undefined): number => {
  if (!raw || !/^\d+$/.test(raw.trim())) return 1;
  const page = Number(raw.trim());
  return Number.isSafeInteger(page) && page >= 1 ? page : 1;
};

const parseField = (spec: FieldSpec, raw: string | undefined): string => {
  const value = raw?.trim() ?? "";
  if (spec.kind === "date") return ISO_DAY.test(value) && !Number.isNaN(Date.parse(value)) ? value : "";
  if (spec.kind === "code") return CODE.test(value) ? value : "";
  return spec.values.includes(value) ? value : spec.fallback;
};

const defaultOf = (spec: FieldSpec): string => (spec.kind === "enum" ? spec.fallback : "");

export const defaultView = <F extends Record<string, string>>(schema: ListSchema<F>): ListView<F> => {
  const filters = {} as F;
  for (const key of Object.keys(schema.fields) as (keyof F)[]) filters[key] = defaultOf(schema.fields[key]) as F[keyof F];
  return { page: 1, limit: schema.limits[0], filters };
};

export const parseView = <F extends Record<string, string>>(schema: ListSchema<F>, params: RawParams): ListView<F> => {
  const filters = {} as F;
  for (const key of Object.keys(schema.fields) as (keyof F)[]) {
    const spec = schema.fields[key];
    filters[key] = parseField(spec, first(params[paramOf(String(key), spec)])) as F[keyof F];
  }
  const limit = Number(first(params[LIMIT]));
  return {
    page: parsePage(first(params[pageParamOf(schema)])),
    limit: schema.limits.includes(limit) ? limit : schema.limits[0],
    filters,
  };
};

/** Query values for `view`; a default comes back as `undefined` so the URL drops it. */
export const toParams = <F extends Record<string, string>>(
  schema: ListSchema<F>,
  view: ListView<F>,
  { includePage = true }: { includePage?: boolean } = {}
): Record<string, string | undefined> => {
  const params: Record<string, string | undefined> = {
    [pageParamOf(schema)]: includePage && view.page > 1 ? String(view.page) : undefined,
    [LIMIT]: view.limit !== schema.limits[0] ? String(view.limit) : undefined,
  };
  for (const key of Object.keys(schema.fields) as (keyof F)[]) {
    const spec = schema.fields[key];
    const value = view.filters[key];
    params[paramOf(String(key), spec)] = value === defaultOf(spec) ? undefined : value;
  }
  return params;
};

/** Whether the route carries any of this list's values (then the route, not a saved view, is the truth). */
export const hasListParams = <F extends Record<string, string>>(schema: ListSchema<F>, params: RawParams): boolean => {
  const keys = [pageParamOf(schema), LIMIT, ...(Object.keys(schema.fields) as (keyof F)[]).map((key) => paramOf(String(key), schema.fields[key]))];
  return keys.some((key) => first(params[key]) !== undefined && first(params[key]) !== "");
};

/** New filters go back to page 1, unless nothing actually changed. */
export const withFilters = <F extends Record<string, string>>(view: ListView<F>, patch: Partial<F>): ListView<F> => {
  const filters = { ...view.filters, ...patch };
  const changed = (Object.keys(patch) as (keyof F)[]).some((key) => filters[key] !== view.filters[key]);
  return changed ? { ...view, filters, page: 1 } : view;
};

export const withLimit = <F extends Record<string, string>>(view: ListView<F>, limit: number): ListView<F> =>
  limit === view.limit ? view : { ...view, limit, page: 1 };

export const totalPagesOf = (total: number, limit: number): number => Math.max(1, Math.ceil(Math.max(0, total) / limit));

export const clampPage = (page: number, totalPages: number): number => Math.min(Math.max(1, page), Math.max(1, totalPages));
