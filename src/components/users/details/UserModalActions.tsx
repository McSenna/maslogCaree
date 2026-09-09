import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { STATUS_ACTIONS, type AdminUser } from "@/services/userService";
import { DETAIL_RADIUS, useUserDetailsPalette } from "./detailsTheme";

function ActionButton({
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
  /** Stacked, `flex-1` would divide the row's height instead of its width. */
  stacked: boolean;
}) {
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
}

type UserModalActionsProps = {
  user: AdminUser;
  onChangeStatus: () => void;
  onViewActivity: () => void;
  /** True while this user's status change is in flight. */
  busy?: boolean;
  /** Stacks the pair where the dialog is too narrow for two full-width buttons. */
  compact: boolean;
  /**
   * Puts the status action last. The phone sheet does: stacked, the last button
   * sits on the bottom edge under the thumb, and the destructive one should not
   * be what a thumb lands on by default — nor should it sit near the close
   * button at the top. The desktop dialog keeps the status action first.
   */
  destructiveLast?: boolean;
};

/**
 * The two things an administrator can do from this dialog.
 *
 * The status action keeps a soft red fill rather than a solid destructive slab:
 * deactivating is reversible and confirmed on the next screen, and a button
 * that shouts is one an admin learns to click past.
 */
export default function UserModalActions({
  user,
  onChangeStatus,
  onViewActivity,
  busy = false,
  compact,
  destructiveLast = false,
}: UserModalActionsProps) {
  const palette = useUserDetailsPalette();
  const action = STATUS_ACTIONS[user.status];

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
}
