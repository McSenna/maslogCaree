import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

import IdDocumentViewer from "../../IdDocumentViewer";
import type { UserRequestDetail } from "../../../../services/userRequestsService";

type Props = {
  verificationId: string | null;
  verification?: UserRequestDetail["verification"];
  formattedFileSize: string;
  showFullIdNumber: boolean;
  onToggleIdNumber: () => void;
};

const IdentityDocumentColumn = ({
  verificationId,
  verification,
  formattedFileSize,
  showFullIdNumber,
  onToggleIdNumber,
}: Props) => {
  const { classes, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <View className="flex-1 gap-4">
      <View className="flex-row items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <View className="flex-row items-center gap-2">
          <Feather name="credit-card" size={15} color="#16A34A" />
          <Text className="text-[14px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
            Identity Document
          </Text>
        </View>

        <Text className={`text-[11px] font-semibold ${classes.textMuted}`}>
          {formattedFileSize ? `${formattedFileSize}` : ""}
        </Text>
      </View>

      <View className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 gap-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text
              className={`text-[11px] font-semibold uppercase tracking-wider ${classes.textMuted}`}
            >
              ID Document Type
            </Text>
            <Text className="text-[14px] font-bold mt-0.5 text-blue-600 dark:text-blue-400">
              {verification?.idTypeName || verification?.idType}
            </Text>
          </View>

          <Pressable
            onPress={onToggleIdNumber}
            accessibilityRole="button"
            className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-200/70 dark:bg-slate-700"
          >
            <Feather
              name={showFullIdNumber ? "eye-off" : "eye"}
              size={12}
              color={isDark ? "#E2E8F0" : "#475569"}
            />
            <Text className={`text-[11px] font-semibold ${classes.textSecondary}`}>
              {showFullIdNumber ? "Mask" : "Reveal"}
            </Text>
          </Pressable>
        </View>

        <View className="pt-2 border-t border-slate-200/80 dark:border-slate-700">
          <Text
            className={`text-[11px] font-semibold uppercase tracking-wider ${classes.textMuted}`}
          >
            ID Number
          </Text>
          <Text
            className={`text-[15px] font-mono font-bold tracking-wider mt-0.5 ${classes.textPrimary}`}
          >
            {showFullIdNumber ? verification?.idNumber : verification?.maskedIdNumber}
          </Text>
        </View>
      </View>

      <IdDocumentViewer
        verificationId={verificationId}
        mimeType={verification?.idMimeType}
        fileName={verification?.idFileName}
        fileSize={verification?.idFileSize}
        height={260}
      />

      <View className="flex-row items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
        <Feather name="info" size={13} color="#64748B" />
        <Text className={`text-[11.5px] ${classes.textMuted} flex-1`}>
          Carefully check that the name, birthdate, and photo on the ID match the resident&apos;s
          registration details.
        </Text>
      </View>
    </View>
  );
};

export default IdentityDocumentColumn;
