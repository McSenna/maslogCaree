import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { statusActionFor, type AdminUser } from "@/features/users/services/userService";
import { DETAIL_RADIUS, useUserDetailsPalette } from "./detailsTheme";

const ActionButton = ({
  icon,
  label,
  text,
  background,
  border,
  onPress,
  disabled,
  accessibilityLabel,
  stacked,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  text: string;
  background: string;
  border: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  stacked: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: Boolean(disabled) }}
      className={`h-[52px] flex-row items-center justify-center gap-2.5 border px-4 ${stacked ? "w-full" : "flex-1"}`}
      style={{
        borderRadius: DETAIL_RADIUS.control,
        backgroundColor: background,
        borderColor: border,
        opacity: disabled ? 0.55 : hovered ? 0.85 : 1,
      }}
    >
      <Feather name={icon} size={17} color={text} />
      <Text className="text-[14.5px] font-semibold" style={{ color: text }}>
        {label}
      </Text>
    </Pressable>
  );
};

type UserModalActionsProps = {
  user: AdminUser;
  onChangeStatus: () => void;
  onViewActivity: () => void;
  busy?: boolean;
  compact: boolean;
  destructiveLast?: boolean;
};

const UserModalActions = ({
  user,
  onChangeStatus,
  onViewActivity,
  busy = false,
  compact,
  destructiveLast = false,
}: UserModalActionsProps) => {
  const palette = useUserDetailsPalette();
  const action = statusActionFor(user);

  const statusButton = (
    <ActionButton
      icon={action.destructive ? "user-x" : "user-check"}
      label={busy ? action.pendingLabel : action.label}
      accessibilityLabel={`${action.label} ${user.fullname}`}
      text={action.destructive ? palette.dangerText : palette.primary}
      background={action.destructive ? palette.dangerBg : palette.neutralBg}
      border={action.destructive ? palette.dangerBorder : palette.neutralBorder}
      onPress={onChangeStatus}
      disabled={busy}
      stacked={compact}
    />
  );

  const activityButton = (
    <ActionButton
      icon="clock"
      label="View Activity Logs"
      accessibilityLabel={`View activity logs for ${user.fullname}`}
      text={palette.neutralText}
      background={palette.neutralBg}
      border={palette.neutralBorder}
      onPress={onViewActivity}
      stacked={compact}
    />
  );

  return (
    <View className={`w-full gap-3 ${compact ? "flex-col" : "flex-row"}`}>
      {destructiveLast ? activityButton : statusButton}
      {destructiveLast ? statusButton : activityButton}
    </View>
  );
};

export default UserModalActions;
