import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import DashboardButton from "@/components/dashboard/admin/DashboardButton";
import { InlineError } from "@/components/ui/dialog/DialogPieces";
import { useKeyboardTop } from "@/components/ui/sheetLayout/useKeyboardTop";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";
import { TYPE } from "@/theme/typography";

import type { AnnouncementFormState } from "../../hooks/useAnnouncementForm";

type AnnouncementEditorFooterProps = {
  form: AnnouncementFormState;
  compact: boolean;
  note: string;
  submitLabel: string;
  submittingLabel: string;
  submitIcon: "send" | "check";
  onCancel: () => void;
};

const BUTTON_HEIGHT = 44;

/** On phones the note wraps above the buttons, and each button takes a full share of the row. */
const AnnouncementEditorFooter = ({ form, compact, note, submitLabel, submittingLabel, submitIcon, onCancel }: AnnouncementEditorFooterProps) => {
  const palette = useResidentDialogPalette();
  const buttonPalette = useAdminSurfacePalette();
  const slot = compact ? "min-w-[120px] grow basis-0" : "";
  const posting = form.pendingAction === "post";
  const savingDraft = form.pendingAction === "draft";
  // With the keyboard up a phone has little height left, and the fields need it more than the note.
  const keyboardOpen = useKeyboardTop(compact) !== null;

  return (
    <View className="gap-3">
      {form.submitError ? <InlineError palette={palette} message={form.submitError} /> : null}
      <View className={compact ? "gap-3" : "flex-row items-center gap-6"}>
        {keyboardOpen ? null : (
          <View className={`min-w-0 flex-row gap-2 ${compact ? "" : "flex-1"}`}>
            <Feather name="info" size={16} color={palette.muted} style={{ marginTop: 3 }} />
            <Text className="min-w-0 flex-1" style={[TYPE.body, { color: palette.muted }]}>
              {note}
            </Text>
          </View>
        )}
        <View className={`flex-row gap-2 ${compact ? "flex-wrap" : ""}`}>
          <View className={slot}>
            <DashboardButton palette={buttonPalette} size="md" height={BUTTON_HEIGHT} fullWidth={compact} label="Cancel" disabled={form.submitting} onPress={onCancel} />
          </View>
          {form.canChooseDraft ? (
            <View className={slot}>
              <DashboardButton
                palette={buttonPalette}
                size="md"
                height={BUTTON_HEIGHT}
                fullWidth={compact}
                label={savingDraft ? "Saving…" : "Save draft"}
                accessibilityHint="Only admins can see a draft, and nobody is notified until you post it"
                loading={savingDraft}
                disabled={posting}
                onPress={() => void form.submit(true)}
              />
            </View>
          ) : null}
          <View className={slot}>
            <DashboardButton
              palette={buttonPalette}
              variant="primary"
              size="md"
              height={BUTTON_HEIGHT}
              fullWidth={compact}
              icon={submitIcon}
              label={posting ? submittingLabel : submitLabel}
              loading={posting}
              disabled={savingDraft}
              onPress={() => void form.submit(false)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default AnnouncementEditorFooter;
