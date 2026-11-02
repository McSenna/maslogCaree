import { View } from "react-native";

import { TableButton } from "@/components/data-table";

import { ROW_ACTION_ITEMS, rowActions } from "../../rowActions";
import type { RowActionKey, User } from "../../userAdmin.types";
import { INLINE_ACTIONS_WIDTH } from "../../userColumnWidths";

export type UserRowActionHandlers = {
  selfId: string | number | null;
  savingOverrideId: string | null;
  onOpenProfile: (id: string) => void;
  onAction: (user: User, action: RowActionKey) => void;
};

type UserRowActionsProps = UserRowActionHandlers & {
  user: User;
  /** Phones keep 44px targets; the desktop table's buttons are 36px to fit a mouse-driven row. */
  touch?: boolean;
};

const TABLE_BLOCK = { width: INLINE_ACTIONS_WIDTH };

/** Every action as its own icon, named for the person, on table rows and phone cards alike. */
const UserRowActions = ({ user, selfId, savingOverrideId, onOpenProfile, onAction, touch = false }: UserRowActionsProps) => {
  const size = touch ? "comfortable" : "default";
  return (
    <View role="group" accessibilityLabel={`Actions for ${user.fullName}`} className={`flex-row flex-wrap items-center ${touch ? "gap-2" : "gap-1"}`} style={touch ? undefined : TABLE_BLOCK}>
      <TableButton size={size} iconOnly icon="eye" label="View account" accessibilityLabel={`View account of ${user.fullName}`} onPress={() => onOpenProfile(user.id)} />
      {rowActions(user, selfId).map((key) => {
        const { label, icon, danger } = ROW_ACTION_ITEMS[key];
        return (
          <TableButton
            key={key}
            size={size}
            iconOnly
            icon={icon}
            label={label}
            tone={danger ? "danger" : "default"}
            loading={savingOverrideId === user.id && (key === "allowWeb" || key === "blockWeb")}
            accessibilityLabel={`${label} of ${user.fullName}`}
            onPress={() => onAction(user, key)}
          />
        );
      })}
    </View>
  );
};

export default UserRowActions;
