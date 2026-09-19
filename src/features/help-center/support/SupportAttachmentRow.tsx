import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import { fileExtensionOf, formatFileSize } from "../utils/support.utils";

type SupportAttachmentRowProps = {
  fileName: string;
  fileSize: number;
  onRemove?: () => void;
};

const SupportAttachmentRow = ({ fileName, fileSize, onRemove }: SupportAttachmentRowProps) => {
  const palette = useResidentDialogPalette();
  const extension = fileExtensionOf(fileName).toUpperCase() || "FILE";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderRadius: RADIUS.control,
        backgroundColor: palette.card,
        borderWidth: 1,
        borderColor: palette.border,
      }}
    >
      <Feather
        name={extension === "PDF" ? "file-text" : "image"}
        size={16}
        color={palette.accent}
      />

      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: "600", color: palette.heading }}>
          {fileName}
        </Text>
        <Text style={{ fontSize: 11.5, color: palette.muted }}>
          {extension} · {formatFileSize(fileSize)}
        </Text>
      </View>

      {onRemove ? (
        <Pressable
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${fileName}`}
          hitSlop={10}
          style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}
        >
          <Feather name="x" size={16} color={palette.muted} />
        </Pressable>
      ) : null}
    </View>
  );
};

export default SupportAttachmentRow;
