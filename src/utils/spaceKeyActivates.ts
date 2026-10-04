// React Native Web presses a Pressable on Enter for any role, but on Space only
// for buttons. Radios and checkboxes are expected to toggle on Space too, so
// these props add that on web; native platforms never fire key events here.
type KeyEventLike = { nativeEvent: { key?: string }; preventDefault: () => void };

export const spaceKeyActivates = (onActivate: () => void) => ({
  onKeyDown: (event: KeyEventLike) => {
    const { key } = event.nativeEvent;
    if (key !== " " && key !== "Spacebar") return;
    event.preventDefault();
    onActivate();
  },
});
