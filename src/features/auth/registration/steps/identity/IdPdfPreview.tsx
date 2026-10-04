import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { REG_COLORS } from "../../registrationTheme";
import { PALETTE } from "@/theme/palette";

type Props = {
  fileName?: string;
  formattedFileSize: string;
};

const IdPdfPreview = ({ fileName, formattedFileSize }: Props) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        gap: 14,
        backgroundColor: PALETTE.slate[50],
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          backgroundColor: PALETTE.red[100],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name="file-text" size={24} color={PALETTE.red[600]} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={1}
          style={{ fontSize: 14, fontWeight: "700", color: REG_COLORS.heading }}
        >
          {fileName || "Government_ID.pdf"}
        </Text>
        <Text style={{ fontSize: 12, color: REG_COLORS.muted, marginTop: 2 }}>
          PDF Document {formattedFileSize ? `• ${formattedFileSize}` : ""}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
          <Feather name="check" size={13} color={PALETTE.success[600]} />
          <Text style={{ fontSize: 11.5, color: PALETTE.success[600], fontWeight: "600" }}>
            Valid PDF attached
          </Text>
        </View>
      </View>
    </View>
  );
};

export default IdPdfPreview;
