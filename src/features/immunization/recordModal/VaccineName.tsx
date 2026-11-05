import { useState } from "react";
import { Text, View } from "react-native";

import IconButton from "@/components/buttons/IconButton";
import { useResponsive } from "@/hooks/useResponsive";

import useScheduleStyles from "./scheduleStyles";

const PHONE_BUTTON = 44;
const DESKTOP_BUTTON = 32;

// Shown in place, not as a floating popover: the table clips anything that leaves
// its cell, and this behaves the same with touch, keyboard and a screen reader.
const VaccineName = ({ name }: { name: string }) => {
  const { styles } = useScheduleStyles();
  const { isMobile } = useResponsive();
  const [expanded, setExpanded] = useState(false);
  return (
    <View>
      <View style={styles.vaccineHead}>
        <Text style={styles.vaccineName}>{name}</Text>
        <IconButton
          icon={expanded ? "chevron-up" : "info"}
          size={isMobile ? PHONE_BUTTON : DESKTOP_BUTTON}
          label={expanded ? `Hide details about ${name}` : `About ${name}`}
          onPress={() => setExpanded((current) => !current)}
        />
      </View>
      {expanded ? (
        <View style={styles.vaccineInfo} accessibilityLiveRegion="polite">
          <Text style={styles.vaccineInfoText}>{name}</Text>
          <Text style={styles.vaccineInfoText}>[VACCINE INFO]</Text>
        </View>
      ) : null}
    </View>
  );
};

export default VaccineName;
