import { useEffect } from "react";
import { Platform, type View } from "react-native";

/** Keyboard navigation within the single-choice popup, including non-button roles. */
const useSelectKeyboard = (
  open: boolean,
  container: View | null,
  value: string,
) => {
  useEffect(() => {
    if (Platform.OS !== "web" || !open || !container) return;
    const root = container as unknown as HTMLElement;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>('[role="radio"]'),
    );
    const selected = items.find(
      (item) => item.getAttribute("aria-checked") === "true",
    );
    (selected ?? items[0])?.focus();
    const keyDown = (event: KeyboardEvent) => {
      const index = items.indexOf(document.activeElement as HTMLElement);
      if (index < 0) return;
      if (event.key === " ") {
        event.preventDefault();
        items[index].click();
        return;
      }
      let next: number;
      switch (event.key) {
        case "ArrowDown":
        case "ArrowRight":
          next = (index + 1) % items.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          next = (index - 1 + items.length) % items.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = items.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      items[next]?.focus();
      items[next]?.scrollIntoView({ block: "nearest" });
    };
    root.addEventListener("keydown", keyDown);
    return () => root.removeEventListener("keydown", keyDown);
  }, [open, container, value]);
};

export default useSelectKeyboard;
