import { Feather } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { PASSWORD_RESET_AVAILABLE, ROLE_CHANGE_AVAILABLE } from "../../services/userAdminApi";
import type { MenuAnchor, User } from "../../userAdmin.types";
import { useUsersTheme } from "../../useUsersTheme";
import MenuCard from "./MenuCard";

type ItemProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  danger?: boolean;
  disabled?: boolean;
  hint?: string;
};

const Item = ({ label, icon, onPress, danger, disabled, hint }: ItemProps) => {
  const palette = useAdminSurfacePalette();
  const color = disabled ? palette.subtle : danger ? palette.statusTones.danger.fg : palette.body;
  const activeBg = danger ? "hover:bg-destructive-bg active:bg-destructive-bg" : "hover:bg-rowopen active:bg-rowopen";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="menuitem"
      accessibilityHint={hint}
      accessibilityState={{ disabled: Boolean(disabled) }}
      className={`min-h-11 flex-row items-center gap-3 rounded-sm px-3 web:cursor-pointer ${disabled ? "" : activeBg}`}
    >
      <Feather name={icon} size={16} color={color} />
      <Text className="text-[14px] font-medium" style={{ color }}>
        {label}
      </Text>
    </Pressable>
  );
};

type RowActionMenuProps = {
  user: User | null;
  /** The signed-in admin's own row: no status action, since the server refuses it. */
  isSelf: boolean;
  anchor: MenuAnchor | null;
  onClose: () => void;
  onViewProfile: (user: User) => void;
  onToggleStatus: (user: User) => void;
};

/**
 * One menu for whichever row's dots button was pressed, opened beside that
 * button on every layout. A transparent Modal with no animation of its own:
 * it shows and goes in one frame, so nothing dark or half-drawn can linger,
 * and only the card animates in. Outside taps, Escape and Android back close
 * it and give focus back to the dots button.
 */
const RowActionMenu = ({ user, isSelf, anchor, onClose, onViewProfile, onToggleStatus }: RowActionMenuProps) => {
  const theme = useUsersTheme();
  const visible = Boolean(user && anchor);
  const focusOnClose = useRef<(() => void) | null>(null);

  const dismiss = () => {
    focusOnClose.current = anchor?.returnFocus ?? null;
    onClose();
  };

  // Runs once the Modal (and its focus trap) has unmounted, so focus stays on the button.
  useEffect(() => {
    if (visible || !focusOnClose.current) return;
    focusOnClose.current();
    focusOnClose.current = null;
  }, [visible]);

  const deactivated = user?.status === "deactivated";

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={dismiss} statusBarTranslucent>
      <View style={theme.vars} className="flex-1 bg-transparent">
        {user && anchor ? (
          <MenuCard key={`${user.id}:${anchor.x}:${anchor.y}`} anchor={anchor} label={`Actions for ${user.fullName}`}>
            <Item label="View profile" icon="user" onPress={() => onViewProfile(user)} />
            <Item label="Change role" icon="edit-2" onPress={onClose} disabled={!ROLE_CHANGE_AVAILABLE} hint="Not available yet" />
            <Item label="Reset password" icon="lock" onPress={onClose} disabled={!PASSWORD_RESET_AVAILABLE} hint="Not available yet" />
            {isSelf ? null : (
              <>
                <View className="my-1 h-px bg-divider" />
                <Item
                  label={deactivated ? "Reactivate account" : "Deactivate account"}
                  icon={deactivated ? "rotate-ccw" : "slash"}
                  danger={!deactivated}
                  onPress={() => onToggleStatus(user)}
                />
              </>
            )}
          </MenuCard>
        ) : null}
        {/* After the card, so the web focus trap starts on the first action; invisible, and out of the tab order. Screen readers can still use it. */}
        <Pressable onPress={dismiss} focusable={false} accessibilityRole="button" accessibilityLabel="Close actions" className="absolute inset-0 bg-transparent" />
      </View>
    </Modal>
  );
};

export default RowActionMenu;
