import { useMemo, useState } from "react";

import { searchHelpContent } from "../utils/helpSearch";

export const useHelpSearch = () => {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchHelpContent(query), [query]);

  return {
    query,
    setQuery,
    clearQuery: () => setQuery(""),
    results,
  };
};
