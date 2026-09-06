import {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
  ZoomIn,
  BounceIn,
} from "react-native-reanimated";

/**
 * Animation preset: Fade + Slide up entrance
 * Perfect for cards and modals entering the screen
 */
export const cardEntranceAnimation = FadeIn.duration(400).springify();

/**
 * Animation preset: Smooth slide up
 * Good for staggered animations in lists
 */
export const slideUpAnimation = (delay: number = 0) =>
  SlideInUp.duration(500).delay(delay);

/**
 * Animation preset: Scale and fade in
 * Creates a "pop" effect for buttons and interactive elements
 */
export const popInAnimation = ZoomIn.duration(300).springify();

/**
 * Animation preset: Bounce entrance
 * Playful animation for attention-grabbing elements
 */
export const bounceInAnimation = BounceIn.duration(600);

/**
 * Animation preset: Staggered cascade
 * Use with list items for sequential entrance
 */
export const staggeredItemAnimation = (index: number, itemDelay: number = 100) =>
  SlideInUp.duration(400).delay(index * itemDelay);

/**
 * Animation preset: Fade exit
 * Smooth disappearance of elements
 */
export const fadeOutAnimation = FadeOut.duration(300);

/**
 * Animation preset: Exit with slide down
 * Smooth dismissal of modals or overlays
 */
export const slideDownExitAnimation = SlideOutDown.duration(400);

/**
 * Reusable animation config object
 */
export const ANIMATION_CONFIG = {
  // Duration in milliseconds
  FAST: 150,
  BASE: 300,
  SLOW: 500,
  
  // Delays for stagger effects
  STAGGER_SMALL: 50,
  STAGGER_MEDIUM: 100,
  STAGGER_LARGE: 200,

  // Spring physics config (optional)
  SPRING: {
    mass: 1,
    damping: 10,
    stiffness: 100,
    overshootClamping: false,
  },
};
