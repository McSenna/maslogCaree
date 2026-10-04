import { Image, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { PALETTE, withAlpha } from "@/theme/palette";

type Props = {
  uri: string;
  formattedFileSize: string;
  onZoom: () => void;
};

const overlayChip = {
  backgroundColor: withAlpha(PALETTE.slate[800], 0.75),
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
} as const;

const IdImagePreview = ({ uri, formattedFileSize, onZoom }: Props) => {
  return (
    <View style={{ position: "relative" }}>
      <View
        style={{
          height: 180,
          backgroundColor: PALETTE.slate[800],
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri }}
          resizeMode="contain"
          style={{ width: "100%", height: "100%" }}
          accessibilityLabel="Uploaded ID Preview"
        />
      </View>

      <View
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          right: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={overlayChip}>
          <Text style={{ color: PALETTE.white, fontSize: 11, fontWeight: "600" }}>
            ID Preview {formattedFileSize ? `(${formattedFileSize})` : ""}
          </Text>
        </View>

        <Pressable
          onPress={onZoom}
          accessibilityRole="button"
          accessibilityLabel="Zoom image"
          style={{ ...overlayChip, flexDirection: "row", alignItems: "center", gap: 4 }}
        >
          <Feather name="maximize-2" size={12} color={PALETTE.white} />
          <Text style={{ color: PALETTE.white, fontSize: 11, fontWeight: "600" }}>Zoom</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default IdImagePreview;
