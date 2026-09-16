import { View } from "react-native";

import { LEARN_MORE_STEPS } from "@/config/learnMoreContent";

import StepItem from "./StepItem";

type HowItWorksProps = {
  horizontal: boolean;
};

const HowItWorks = ({ horizontal }: HowItWorksProps) => (
  <View
    style={{
      flexDirection: horizontal ? "row" : "column",
      alignItems: horizontal ? "flex-start" : "stretch",
      gap: horizontal ? 10 : 0,
    }}
  >
    {LEARN_MORE_STEPS.map((step, index) => (
      <StepItem
        key={step.key}
        step={step}
        index={index}
        horizontal={horizontal}
        showConnector={index < LEARN_MORE_STEPS.length - 1}
      />
    ))}
  </View>
);

export default HowItWorks;
