import { View } from "react-native";

import { DialogActions, InlineError } from "@/components/ui/dialog/DialogPieces";
import { useResidentDialogPalette } from "@/design/residentDialogTheme";

import type { useSupportForm } from "../hooks/useSupportForm";

type SupportFormActionsProps = {
  form: ReturnType<typeof useSupportForm>;
  onCancel: () => void;
};

const SupportFormActions = ({ form, onCancel }: SupportFormActionsProps) => {
  const palette = useResidentDialogPalette();

  return (
    <View style={{ gap: 10 }}>
      {form.submitError ? <InlineError palette={palette} message={form.submitError} /> : null}

      <DialogActions
        palette={palette}
        secondaryLabel="Cancel"
        onSecondary={onCancel}
        primaryLabel={form.submitting ? "Submitting..." : "Submit Support Request"}
        onPrimary={() => void form.submit()}
        busy={form.submitting}
        icon="send"
      />
    </View>
  );
};

export default SupportFormActions;
