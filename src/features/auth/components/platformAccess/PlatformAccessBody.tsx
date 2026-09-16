import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { LANDING_COLORS } from "@/config/landingAssets";

const PlatformAccessBody = ({
  title,
  message,
  supporting,
  isNarrow,
}: {
  title: string;
  message: string;
  supporting?: string;
  isNarrow: boolean;
}) => (
  <>
    <View
      className="items-center justify-center"
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: LANDING_COLORS.softBlue,
      }}
    >
      <MaterialCommunityIcons name="cellphone-check" size={30} color={LANDING_COLORS.primaryBlue} />
    </View>

    <Text
      accessibilityRole="header"
      className="text-center font-bold"
      style={{
        marginTop: 18,
        fontSize: isNarrow ? 19 : 21,
        color: LANDING_COLORS.navy,
        letterSpacing: -0.2,
      }}
    >
      {title}
    </Text>

    <Text
      className="text-center"
      style={{
        marginTop: 10,
        fontSize: isNarrow ? 14 : 14.5,
        lineHeight: isNarrow ? 21 : 22,
        color: LANDING_COLORS.mutedText,
      }}
    >
      {message}
    </Text>

    {supporting ? (
      <View
        className="w-full"
        style={{
          marginTop: 18,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#DDEBFF",
          backgroundColor: "#F4F9FF",
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        <Text className="text-center" style={{ fontSize: 12.5, lineHeight: 18.5, color: "#3B5375" }}>
          {supporting}
        </Text>
      </View>
    ) : null}
  </>
);

export default PlatformAccessBody;
