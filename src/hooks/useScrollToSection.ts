import { useCallback, useMemo, useRef } from "react";
import type { ScrollView, View } from "react-native";

const EDGE = 12;

type SectionAnchor = (node: View | null) => void;

/**
 * Scrolls a ScrollView to a marked section, for summary cards that point at a
 * panel further down. Positions come from measureInWindow against a marker at
 * the top of the content, which works the same on native and web and does not
 * depend on how deeply the section is nested. `topOffset` is where the marker
 * sits in the scroll content (usually the top padding).
 */
export const useScrollToSection = <Key extends string>(keys: readonly Key[], topOffset = 0) => {
  const scrollRef = useRef<ScrollView>(null);
  const topRef = useRef<View>(null);
  const sections = useRef(new Map<Key, View | null>());

  // One stable ref callback per section, built once from the keys.
  const keyList = keys.join("|");
  const anchors = useMemo(
    () =>
      Object.fromEntries(
        keyList.split("|").map((key): [string, SectionAnchor] => [
          key,
          (node) => {
            sections.current.set(key as Key, node);
          },
        ])
      ) as Record<Key, SectionAnchor>,
    [keyList]
  );

  const scrollTo = useCallback(
    (key: Key) => {
      const target = sections.current.get(key);
      const top = topRef.current;
      const scroller = scrollRef.current;
      if (!target || !top || !scroller) return;

      top.measureInWindow((_topX, topY) => {
        target.measureInWindow((_x, targetY) => {
          scroller.scrollTo({ y: Math.max(0, targetY - topY + topOffset - EDGE), animated: true });
        });
      });
    },
    [topOffset]
  );

  return { scrollRef, topRef, anchors, scrollTo };
};
