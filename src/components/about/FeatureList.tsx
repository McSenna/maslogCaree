import { View } from "react-native";

import { LEARN_MORE_FEATURES } from "@/config/learnMoreContent";

import AboutFeature from "./AboutFeature";

type FeatureListProps = {
  columns: boolean;
};

const FeatureList = ({ columns }: FeatureListProps) => (
  <View
    style={{
      flexDirection: columns ? "row" : "column",
      alignItems: columns ? "stretch" : undefined,
      gap: 12,
    }}
  >
    {LEARN_MORE_FEATURES.map((feature) => (
      <AboutFeature key={feature.key} feature={feature} stacked={!columns} />
    ))}
  </View>
);

export default FeatureList;
