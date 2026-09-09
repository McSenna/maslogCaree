import { Text, View } from "react-native";
import { RESIDENT_COLORS } from "./residentTheme";

type WelcomeBannerProps = {
  greeting: string;
  firstName: string;
  stacked?: boolean;
};

const WelcomeBanner = ({ greeting, firstName, stacked = false }: WelcomeBannerProps) => {
  const heading = (
    <View className="min-w-0 flex-1 justify-center">
      <Text
        accessibilityRole="header"
        className={stacked ? "text-[24px] font-extrabold" : "text-[30px] font-extrabold"}
        style={{ color: RESIDENT_COLORS.heading }}
      >
        {greeting}, {firstName}! 👋
      </Text>
      <Text
        className={stacked ? "mt-1 text-[14px]" : "mt-1.5 text-[16px]"}
        style={{ color: RESIDENT_COLORS.muted }}
      >
        Take charge of your health today.
      </Text>
    </View>
  );


  if (stacked) {
    return (
      <View className="w-full gap-3">
        {heading}
      </View>
    );
  }

  return (
    <View className="w-full flex-row items-center gap-6">
      {heading}
    </View>
  );
};

export default WelcomeBanner;
