import { useCallback, useRef, type RefObject } from "react";
import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";

const CONTENT_TOP_PADDING = 12;
const REVEAL_MARGIN = 16;
const MIN_VISIBLE_HEIGHT = 120;

/**
 * Scrolls a card into view only when it sits outside the current viewport, so
 * entering inline edit mode never moves content the user can already see.
 */
export const useCardReveal = (scrollRef: RefObject<ScrollView | null>) => {
  const scrollY = useRef(0);
  const viewportHeight = useRef(0);
  const panelTop = useRef<number | null>(null);
  const cardTop = useRef<number | null>(null);
  const cardHeight = useRef(0);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = event.nativeEvent.contentOffset.y;
  }, []);

  const onViewportLayout = useCallback((event: LayoutChangeEvent) => {
    viewportHeight.current = event.nativeEvent.layout.height;
  }, []);

  const onPanelLayout = useCallback((event: LayoutChangeEvent) => {
    panelTop.current = event.nativeEvent.layout.y;
  }, []);

  const onCardLayout = useCallback((event: LayoutChangeEvent) => {
    cardTop.current = event.nativeEvent.layout.y;
    cardHeight.current = event.nativeEvent.layout.height;
  }, []);

  const revealCard = useCallback(() => {
    requestAnimationFrame(() => {
      const viewport = viewportHeight.current;
      if (!viewport || panelTop.current === null || cardTop.current === null) return;

      const top = CONTENT_TOP_PADDING + panelTop.current + cardTop.current;
      const peek = Math.min(cardHeight.current || MIN_VISIBLE_HEIGHT, MIN_VISIBLE_HEIGHT);
      const alreadyVisible =
        top >= scrollY.current && top + peek <= scrollY.current + viewport;

      if (alreadyVisible) return;

      scrollRef.current?.scrollTo({ y: Math.max(top - REVEAL_MARGIN, 0), animated: true });
    });
  }, [scrollRef]);

  return { onScroll, onViewportLayout, onPanelLayout, onCardLayout, revealCard };
};
