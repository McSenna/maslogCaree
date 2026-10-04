import { Text, View } from "react-native";

import { useQueuePalette } from "@/components/appointmentQueue/queueTheme";
import { ErrorBanner, FooterButtons } from "@/components/medicalRecord/complete/CompletionChrome";
import Checkbox from "@/components/ui/Checkbox";
import { PALETTE } from "@/theme/palette";

import type { RecordEditorState } from "../../hooks/useRecordEditor";

type Props = { editor: RecordEditorState; onClose: () => void };

/** Stays in view while the form scrolls, so what still needs fixing is never out of sight. */
const EditorFooter = ({ editor, onClose }: Props) => {
  const palette = useQueuePalette();

  return (
    <View className="w-full gap-3">
      {editor.problems.length > 0 ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" className="text-[12.5px] font-medium leading-[18px]" style={{ color: PALETTE.red[600] }}>
          {`Check the fields marked in red: ${editor.problems.join(", ")}.`}
        </Text>
      ) : null}
      {editor.submitError ? <ErrorBanner message={editor.submitError} /> : null}
      {editor.isEditing ? null : (
        <View className="flex-row items-center gap-3">
          <Checkbox checked={editor.keepOpen} onChange={editor.setKeepOpen} accessibilityLabel="Keep this form open for this resident's next record" />
          <Text className="min-w-0 flex-1 text-[12.5px] leading-[18px]" style={{ color: palette.body }} onPress={() => editor.setKeepOpen(!editor.keepOpen)}>
            Keep this form open for this resident&apos;s next record
          </Text>
        </View>
      )}
      <FooterButtons
        backLabel="Cancel"
        onBack={onClose}
        nextLabel={editor.saving ? "Saving..." : editor.isEditing ? "Save changes" : "Save medical record"}
        onNext={() => editor.submit(false)}
        busy={editor.saving}
        disabled={false}
      />
    </View>
  );
};

export default EditorFooter;
