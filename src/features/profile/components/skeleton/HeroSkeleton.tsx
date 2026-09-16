import { Animated, View } from "react-native";
import { PROFILE_RADIUS } from "../../config/profileTheme";
import Block from "./Block";

const HeroSkeleton = ({ opacity }: { opacity: Animated.Value }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 18,
      padding: 20,
      borderRadius: PROFILE_RADIUS.hero,
      backgroundColor: "#F1F7FE",
      borderWidth: 1,
      borderColor: "#DCEAFB",
    }}
  >
    <Block width={112} height={112} radius={56} opacity={opacity} />
    <View style={{ flex: 1, gap: 10 }}>
      <Block width="45%" height={12} opacity={opacity} />
      <Block width="72%" height={22} opacity={opacity} />
      <Block width={96} height={22} radius={999} opacity={opacity} />
      <Block width="55%" height={12} opacity={opacity} />
    </View>
  </View>
);

export default HeroSkeleton;
