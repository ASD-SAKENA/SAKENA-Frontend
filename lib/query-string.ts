type QueryPrimitive = string | number | boolean;
type QueryValue = QueryPrimitive | QueryPrimitive[] | null | undefined;

export function toQueryString(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;

    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item === "" || item === false) continue;
      search.append(key, item === true ? "true" : String(item));
    }
  }

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
