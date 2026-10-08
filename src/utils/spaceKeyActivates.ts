type KeyEventLike = { nativeEvent: { key?: string }; preventDefault: () => void };

export const spaceKeyActivates = (onActivate: () => void) => ({
  onKeyDown: (event: KeyEventLike) => {
    const { key } = event.nativeEvent;
    if (key !== " " && key !== "Spacebar") return;
    event.preventDefault();
    onActivate();
  },
});
