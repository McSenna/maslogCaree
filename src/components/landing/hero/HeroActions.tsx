import { View } from "react-native";
import { LANDING_CONTENT } from "@/config/landingContent";
import HeroActionButton from "./HeroActionButton";

type HeroActionsProps = {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
  stacked?: boolean;
  buttonHeight?: number;
  gap?: number;
};

const HeroActions = ({
  onGetStarted,
  onLearnMore,
  stacked = false,
  buttonHeight,
  gap = 12,
}: HeroActionsProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap,
        alignSelf: stacked ? "stretch" : "flex-start",
      }}
    >
      <HeroActionButton
        label={LANDING_CONTENT.actions.primary.label}
        icon={LANDING_CONTENT.actions.primary.icon}
        variant="primary"
        onPress={onGetStarted}
        fullWidth={stacked}
        height={buttonHeight}
      />

      <HeroActionButton
        label={LANDING_CONTENT.actions.secondary.label}
        icon={LANDING_CONTENT.actions.secondary.icon}
        variant="secondary"
        onPress={onLearnMore}
        fullWidth={stacked}
        height={buttonHeight}
      />
    </View>
  );
};

export default HeroActions;
