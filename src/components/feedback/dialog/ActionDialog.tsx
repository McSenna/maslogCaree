import type { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Button from "@/components/buttons/Button";
import ResponsiveDialog from "@/components/ui/dialog/ResponsiveDialog";
import { useResponsive } from "@/hooks/useResponsive";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

export type ActionDialogButton = {
  label: string;
  variant: "primary" | "secondary" | "danger";
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

type ActionDialogProps = {
  visible: boolean;
  title: string;
  message?: string;
  icon?: keyof typeof Feather.glyphMap;
  destructive?: boolean;
  actions: ActionDialogButton[];
  onClose: () => void;
  busy?: boolean;
};

const ActionDialog = ({ visible, title, message, icon, destructive = false, actions, onClose, busy = false }: ActionDialogProps) => {
  const colors = useThemeColors();
  const { isMobile } = useResponsive();
  const stacked = isMobile && actions.length > 2;
  const guardedClose = () => {
    if (!busy) onClose();
  };

  const footer = (
    <View
      style={{
        flexDirection: stacked ? "column-reverse" : "row",
        justifyContent: "flex-end",
        flexWrap: stacked ? "nowrap" : "wrap",
        gap: SPACING.sm,
      }}
    >
      {actions.map((action) => (
        <Button
          key={action.label}
          label={action.label}
          variant={action.variant}
          onPress={action.onPress}
          loading={action.loading}
          disabled={action.disabled || (busy && !action.loading)}
          fullWidth={stacked || isMobile}
          style={stacked || !isMobile ? undefined : { flex: 1 }}
        />
      ))}
    </View>
  );

  return (
    <ResponsiveDialog
      visible={visible}
      title={title}
      icon={icon ?? (destructive ? "alert-triangle" : "help-circle")}
      tint={destructive ? colors.danger.fg : undefined}
      tintSoft={destructive ? colors.danger.bg : undefined}
      onClose={guardedClose}
      onDismissRequest={() => busy}
      maxWidth={440}
      footer={footer}
    >
      {message ? <Text style={[TYPE.body, { color: colors.body }]}>{message}</Text> : null}
    </ResponsiveDialog>
  );
};

export default ActionDialog;
