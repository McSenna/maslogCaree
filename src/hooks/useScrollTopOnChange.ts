import { useEffect, useRef } from "react";

type Scroller = {
  scrollTo?: (options: { x?: number; y?: number; animated?: boolean }) => void;
  scrollToOffset?: (options: { offset: number; animated?: boolean }) => void;
};

/**
 * A ref for a list's ScrollView or FlatList that jumps it to the top whenever
 * `value` (the page number) changes, so a new page starts at its first row.
 * The first render is left alone: a refreshed page already starts at the top.
 * Pass a constant for lists that append pages, or loading more would jump.
 */
export const useScrollTopOnChange = <T extends Scroller>(value: unknown) => {
  const ref = useRef<T>(null);
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    const scroller = ref.current;
    if (scroller?.scrollToOffset) scroller.scrollToOffset({ offset: 0, animated: false });
    else scroller?.scrollTo?.({ y: 0, animated: false });
  }, [value]);

  return ref;
};
