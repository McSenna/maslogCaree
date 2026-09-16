import { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";
import { MISSION_RADIUS, useMissionSchedulePalette } from "./missionScheduleTheme";

type ServiceToggleProps = {
  value: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
};

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 30;
const KNOB = 24;
const INSET = (TRACK_HEIGHT - KNOB) / 2;

const ServiceToggle = ({ value, onChange, label, disabled = false }: ServiceToggleProps) => {
  const palette = useMissionSchedulePalette();
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  return (
    <Pressable
      onPress={onChange}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label}
      hitSlop={{ top: 7, bottom: 7, left: 4, right: 4 }}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: MISSION_RADIUS.pill,
          justifyContent: "center",
          backgroundColor: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [palette.off, palette.on],
          }),
        }}
      >
        <Animated.View
          style={{
            width: KNOB,
            height: KNOB,
            borderRadius: KNOB / 2,
            backgroundColor: "#FFFFFF",
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [INSET, TRACK_WIDTH - KNOB - INSET],
                }),
              },
            ],
            shadowColor: "#0F172A",
            shadowOpacity: 0.18,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 1 },
            elevation: 2,
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

export default ServiceToggle;
