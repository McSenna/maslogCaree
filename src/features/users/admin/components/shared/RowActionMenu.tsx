import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MENU_SHADOW } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { useReducedMotion } from "@/theme/motion";

import { PASSWORD_RESET_AVAILABLE, ROLE_CHANGE_AVAILABLE } from "../../services/userAdminApi";
import type { MenuAnchor, User } from "../../userAdmin.types";
import { useUsersTheme } from "../../useUsersTheme";

const MENU_WIDTH = 210;

type ItemProps = {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
  danger?: boolean;
  disabled?: boolean;
  hint?: string;
  sheet: boolean;
};

const Item = ({ label, icon, onPress, danger, disabled, hint, sheet }: ItemProps) => {
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
      className={`${sheet ? "min-h-[52px] px-4" : "min-h-11 rounded-sm px-3"} flex-row items-center gap-3 web:cursor-pointer ${disabled ? "" : activeBg}`}
    >
      <Feather name={icon} size={16} color={color} />
      <Text className={`${sheet ? "text-[15px]" : "text-[14px]"} font-medium`} style={{ color }}>
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
 * One menu for whichever row's dots button was pressed: a dropdown under the
 * button on wide layouts, a bottom sheet on phones. A Modal, so outside
 * presses, Escape and Android back all close it.
 */
const RowActionMenu = ({ user, isSelf, anchor, onClose, onViewProfile, onToggleStatus }: RowActionMenuProps) => {
  const theme = useUsersTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const sheet = anchor === null;
  const deactivated = user?.status === "deactivated";

  // Right edges line up with the dots button; dynamic position only.
  const popover = anchor ? { top: anchor.y, left: Math.max(8, anchor.x + anchor.width - MENU_WIDTH), ...MENU_SHADOW } : undefined;
  const sheetInset = { paddingBottom: Math.max(insets.bottom, 12) };

  const items = user ? (
    <>
      <Item sheet={sheet} label="View profile" icon="user" onPress={() => onViewProfile(user)} />
      <Item sheet={sheet} label="Change role" icon="edit-2" onPress={onClose} disabled={!ROLE_CHANGE_AVAILABLE} hint="Not available yet" />
      <Item sheet={sheet} label="Reset password" icon="lock" onPress={onClose} disabled={!PASSWORD_RESET_AVAILABLE} hint="Not available yet" />
      {isSelf ? null : (
        <>
          <View className="my-1 h-px bg-divider" />
          <Item
            sheet={sheet}
            label={deactivated ? "Reactivate account" : "Deactivate account"}
            icon={deactivated ? "rotate-ccw" : "slash"}
            danger={!deactivated}
            onPress={() => onToggleStatus(user)}
          />
        </>
      )}
    </>
  ) : null;

  return (
    <Modal visible={Boolean(user)} transparent animationType={reducedMotion ? "none" : sheet ? "slide" : "fade"} onRequestClose={onClose} statusBarTranslucent>
      <View style={theme.vars} className={`flex-1 ${sheet ? "justify-end bg-scrim" : ""}`}>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close actions" className="absolute inset-0" />
        {sheet ? (
          <View style={sheetInset} accessibilityRole="menu" className="rounded-t-panel border-t border-line bg-canvas pt-2">
            <Text accessibilityRole="header" numberOfLines={1} className="px-4 py-3 text-[15px] font-semibold text-ink">
              {user?.fullName}
            </Text>
            {items}
          </View>
        ) : (
          <View style={popover} accessibilityRole="menu" accessibilityLabel={`Actions for ${user?.fullName ?? ""}`} className="absolute w-[210px] rounded-control border border-line bg-canvas p-1">
            {items}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default RowActionMenu;
