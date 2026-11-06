import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Modal from "@/components/ui/AppModal";
import { useFocusTrap, useWebModalBehavior } from "@/hooks/useWebModalBehavior";
import { useReducedMotion } from "@/theme/motion";

import ResidentDetailsFrame, { type ResidentDetailsFrameProps } from "./ResidentDetailsFrame";

/**
 * Full-screen sheet for phones and the Android app. The footer stays pinned
 * above the home indicator; Android's back button and gesture close it through
 * onRequestClose, and Escape closes it on a phone browser.
 */
const ResidentDetailsSheet = (props: ResidentDetailsFrameProps) => {
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  useWebModalBehavior(true, props.onClose);
  const attachFocusTrap = useFocusTrap(true);

  return (
    <Modal
      visible
      animationType={reducedMotion ? "none" : "slide"}
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={props.onClose}
      {...Platform.select({ web: { "aria-labelledby": props.titleId } as object })}
    >
      <View
        ref={attachFocusTrap as never}
        accessibilityViewIsModal
        className="flex-1"
        style={{ paddingTop: insets.top, backgroundColor: props.colors.surface }}
      >
        <ResidentDetailsFrame {...props} bottomInset={insets.bottom} fill />
      </View>
    </Modal>
  );
};

export default ResidentDetailsSheet;
