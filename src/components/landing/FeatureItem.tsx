import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LANDING_COLORS } from "@/config/landingAssets";
import { useInteractiveLift } from "./motion/useInteractiveLift";

export type FeatureMetrics = {
  iconBox: number;
  titleSize: number;
  descriptionSize: number;
  rowPadding: number;
};

interface FeatureItemProps {
  icon?: keyof typeof Ionicons.glyphMap;
  customIcon?: React.ReactNode;
  iconColor?: string;
  iconBgColor: string;
  title: string;
  description: string;
  metrics: FeatureMetrics;
}

const FeatureItem = ({
  icon,
  customIcon,
  iconColor = LANDING_COLORS.primaryBlue,
  iconBgColor,
  title,
  description,
  metrics,
}: FeatureItemProps) => {
  const lift = useInteractiveLift({ lift: 3, pressScale: 1 });
  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.spring(iconScale, {
      toValue: lift.hovered ? 1.07 : 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    });

    animation.start();

    return () => animation.stop();
  }, [lift.hovered, iconScale]);

  return (
    <Animated.View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${title}. ${description}`}
      onPointerEnter={lift.handlers.onHoverIn}
      onPointerLeave={lift.handlers.onHoverOut}
      style={[
        styles.row,
        {
          gap: Math.round(metrics.iconBox * 0.28),
          padding: metrics.rowPadding,
          marginHorizontal: -metrics.rowPadding,
        },
        lift.hovered && styles.rowHovered,
        lift.liftStyle,
      ]}
    >
      <Animated.View
        style={[
          styles.iconBox,
          {
            width: metrics.iconBox,
            height: metrics.iconBox,
            borderRadius: Math.round(metrics.iconBox * 0.31),
            backgroundColor: iconBgColor,
            transform: [{ scale: iconScale }],
          },
        ]}
      >
        {customIcon ? customIcon : icon ? <Ionicons name={icon} size={28} color={iconColor} /> : null}
      </Animated.View>

      <View style={styles.textContainer}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { fontSize: metrics.titleSize, lineHeight: Math.round(metrics.titleSize * 1.3) },
          ]}
        >
          {title}
        </Text>
        <Text
          numberOfLines={2}
          style={[
            styles.description,
            {
              fontSize: metrics.descriptionSize,
              lineHeight: Math.round(metrics.descriptionSize * 1.45),
            },
          ]}
        >
          {description}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "transparent",
    ...Platform.select({
      web: {
        transition: "background-color 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
      } as any,
    }),
  },
  rowHovered: {
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderColor: "#DCE8F8",
    ...Platform.select({
      web: { boxShadow: "0px 12px 28px rgba(8, 21, 47, 0.08)" } as any,
    }),
  },
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontWeight: "700",
    color: LANDING_COLORS.navy,
    letterSpacing: -0.2,
  },
  description: {
    color: LANDING_COLORS.mutedText,
    fontWeight: "400",
  },
});

export default FeatureItem;
