import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { formatFileSize } from "./idDocumentFormat";

const PdfDocumentPreview = ({
  frameClass,
  height,
  fileName,
  fileSize,
  canOpenExternally,
  onOpenExternally,
  textPrimary,
  textMuted,
}: {
  frameClass: string;
  height: number;
  fileName?: string;
  fileSize?: number;
  canOpenExternally: boolean;
  onOpenExternally: () => void;
  textPrimary: string;
  textMuted: string;
}) => (
  <View className={frameClass} style={{ minHeight: height }}>
    <View className="w-full items-center justify-center gap-3 p-8">
      <View className="h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/60">
        <Feather name="file-text" size={32} color="#DC2626" />
      </View>
      <View className="items-center">
        <Text className={`text-center text-[14px] font-bold ${textPrimary}`} numberOfLines={1}>
          {fileName || "Government_ID.pdf"}
        </Text>
        <Text className={`mt-1 text-center text-[12px] ${textMuted}`}>
          PDF Document{formatFileSize(fileSize) ? ` • ${formatFileSize(fileSize)}` : ""}
        </Text>
      </View>

      {canOpenExternally ? (
        <Pressable
          onPress={onOpenExternally}
          accessibilityRole="button"
          accessibilityLabel="Open PDF document in a new tab"
          className="mt-2 flex-row items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 shadow-sm active:opacity-85"
        >
          <Feather name="external-link" size={14} color="#fff" />
          <Text className="text-xs font-bold text-white">View Secure PDF</Text>
        </Pressable>
      ) : (
        <Text className={`mt-1 px-4 text-center text-[11.5px] ${textMuted}`}>
          PDF documents can be opened from the admin console on the web.
        </Text>
      )}
    </View>
  </View>
);

export default PdfDocumentPreview;
