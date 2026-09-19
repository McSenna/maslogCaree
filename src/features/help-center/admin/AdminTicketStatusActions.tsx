import { Pressable, Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import { SUPPORT_STATUS_LABELS, SUPPORT_STATUS_ORDER } from "../constants/support.constants";
import type { SupportStatus } from "../types/support.types";

type AdminTicketStatusActionsProps = {
  current: SupportStatus;
  busy: boolean;
  onChange: (status: SupportStatus) => void;
};

const AdminTicketStatusActions = ({ current, busy, onChange }: AdminTicketStatusActionsProps) => {
  const palette = useResidentDialogPalette();

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontSize: 13, fontWeight: "700", color: palette.heading }}>
        Update status
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {SUPPORT_STATUS_ORDER.map((status) => {
          const active = status === current;

          return (
            <Pressable
              key={status}
              onPress={() => onChange(status)}
              disabled={busy || active}
              accessibilityRole="button"
              accessibilityState={{ selected: active, disabled: busy || active }}
              style={{
                minHeight: 40,
                justifyContent: "center",
                paddingHorizontal: 14,
                borderRadius: RADIUS.pill,
                backgroundColor: active ? palette.accent : palette.card,
                borderWidth: 1,
                borderColor: active ? palette.accent : palette.border,
                opacity: busy && !active ? 0.55 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: 12.5,
                  fontWeight: "600",
                  color: active ? "#FFFFFF" : palette.body,
                }}
              >
                {SUPPORT_STATUS_LABELS[status]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default AdminTicketStatusActions;
