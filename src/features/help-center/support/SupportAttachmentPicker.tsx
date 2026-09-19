import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import SupportAttachmentRow from "./SupportAttachmentRow";
import SupportFieldShell from "./SupportFieldShell";
import { SUPPORT_LIMITS } from "../constants/support.constants";
import { pickSupportAttachment, type PickedSupportFile } from "../utils/supportFilePicker";
import type { SupportAttachmentDraft } from "../types/support.types";

type SupportAttachmentPickerProps = {
  attachments: SupportAttachmentDraft[];
  error?: string | null;
  disabled?: boolean;
  onAdd: (file: PickedSupportFile) => void;
  onRemove: (id: string) => void;
};

const SupportAttachmentPicker = ({
  attachments,
  error,
  disabled = false,
  onAdd,
  onRemove,
}: SupportAttachmentPickerProps) => {
  const palette = useResidentDialogPalette();
  const [pickError, setPickError] = useState<string | null>(null);
  const atLimit = attachments.length >= SUPPORT_LIMITS.maxAttachments;

  const handlePick = async () => {
    setPickError(null);

    try {
      const file = await pickSupportAttachment();
      if (file) onAdd(file);
    } catch {
      setPickError("Could not open the file picker. Please try again.");
    }
  };

  return (
    <SupportFieldShell
      label="Attachments (optional)"
      hint={`JPG, PNG, or PDF · up to ${SUPPORT_LIMITS.maxAttachments} files`}
      error={error ?? pickError ?? undefined}
    >
      <View style={{ gap: 8 }}>
        {attachments.map((attachment) => (
          <SupportAttachmentRow
            key={attachment.id}
            fileName={attachment.fileName}
            fileSize={attachment.fileSize}
            onRemove={disabled ? undefined : () => onRemove(attachment.id)}
          />
        ))}

        <Pressable
          onPress={() => void handlePick()}
          disabled={disabled || atLimit}
          accessibilityRole="button"
          accessibilityLabel="Add an attachment"
          accessibilityState={{ disabled: disabled || atLimit }}
          style={{
            minHeight: 44,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: RADIUS.control,
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: palette.border,
            opacity: disabled || atLimit ? 0.5 : 1,
          }}
        >
          <Feather name="paperclip" size={15} color={palette.accent} />
          <Text style={{ fontSize: 13, fontWeight: "600", color: palette.accent }}>
            {atLimit ? "Attachment limit reached" : "Add attachment"}
          </Text>
        </Pressable>
      </View>
    </SupportFieldShell>
  );
};

export default SupportAttachmentPicker;
