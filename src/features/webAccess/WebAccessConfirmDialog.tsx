import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import ActionDialog from "@/components/feedback/dialog/ActionDialog";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import type { ConfirmCopy } from "@/features/users/admin/confirmCopy";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

const REASON_MAX_LENGTH = 300;
const REASON_LABEL = "Reason (optional)";

type Props = {
  visible: boolean;
  copy: ConfirmCopy | null;
  saving: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
};

/** Names who is affected and what changes, and takes the optional reason for the audit trail. */
const WebAccessConfirmDialog = ({ visible, copy, saving, onConfirm, onCancel }: Props) => {
  const palette = useAdminSurfacePalette();
  const [reason, setReason] = useState("");
  const [wasVisible, setWasVisible] = useState(visible);

  // Each confirmation starts with an empty reason, never the last resident's.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setReason("");
  }

  return (
    <ActionDialog
      visible={visible}
      title={copy?.title ?? ""}
      message={copy?.body}
      destructive={copy?.destructive}
      busy={saving}
      onClose={onCancel}
      actions={[
        { label: "Cancel", variant: "secondary", onPress: onCancel },
        { label: copy?.confirmLabel ?? "", variant: copy?.destructive ? "danger" : "primary", loading: saving, onPress: () => onConfirm(reason) },
      ]}
    >
      <View style={{ gap: SPACING.xs }}>
        <Text style={[TYPE.bodyStrong, { color: palette.heading }]}>{REASON_LABEL}</Text>
        <TextInput
          value={reason}
          onChangeText={setReason}
          editable={!saving}
          maxLength={REASON_MAX_LENGTH}
          multiline
          numberOfLines={2}
          accessibilityLabel={REASON_LABEL}
          accessibilityHint="Saved in the audit trail. Leave out health details."
          style={[TYPE.body, { minHeight: 64, padding: SPACING.sm, borderWidth: 1, borderRadius: 8, borderColor: palette.controlBorder, color: palette.heading, textAlignVertical: "top" }]}
        />
        <Text style={[TYPE.caption, { color: palette.muted }]}>Saved in the audit trail. Leave out health details.</Text>
      </View>
    </ActionDialog>
  );
};

export default WebAccessConfirmDialog;
