import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { REG_COLORS, REG_RADIUS } from "../../registrationTheme";
import { PALETTE } from "@/theme/palette";

type Props = {
  onPress: () => void;
  isProcessing: boolean;
  hasError: boolean;
};

const IdUploadDropzone = ({ onPress, isProcessing, hasError }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={isProcessing}
      accessibilityRole="button"
      accessibilityLabel="Upload Government ID document"
      style={({ pressed }) => ({
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: hasError ? PALETTE.red[500] : pressed ? REG_COLORS.primary : PALETTE.blue[300],
        backgroundColor: pressed ? PALETTE.blue[50] : PALETTE.slate[50],
        borderRadius: REG_RADIUS.card,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        opacity: isProcessing ? 0.6 : 1,
      })}
    >
      {isProcessing ? (
        <ActivityIndicator size="small" color={REG_COLORS.primary} />
      ) : (
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: PALETTE.blue[100],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="upload-cloud" size={26} color={REG_COLORS.primary} />
        </View>
      )}

      <View style={{ alignItems: "center", gap: 4 }}>
        <Text style={{ fontSize: 14.5, fontWeight: "700", color: REG_COLORS.heading }}>
          {isProcessing ? "Processing Document..." : "Click or tap to upload Government ID"}
        </Text>
        <Text style={{ fontSize: 12, color: REG_COLORS.muted, textAlign: "center" }}>
          JPG, PNG or PDF up to 10MB
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: PALETTE.slate[100],
          borderRadius: 20,
        }}
      >
        <Feather name="shield" size={13} color={PALETTE.slate[700]} />
        <Text style={{ fontSize: 11.5, fontWeight: "600", color: PALETTE.slate[700] }}>
          Stored privately & securely for Admin review only
        </Text>
      </View>
    </Pressable>
  );
};

export default IdUploadDropzone;
