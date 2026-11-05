import { StyleSheet, View } from "react-native";
import Button from "@/components/buttons/Button";
import { ErrorBanner } from "@/components/medicalRecord/complete/CompletionChrome";
import { useResponsive } from "@/hooks/useResponsive";
import { SPACING } from "@/theme/spacing";

type Action = { label: string; onPress: () => void; loading?: boolean; disabled?: boolean };

type Props = {
  /** Shown beside the actions, so it is in view however far the body is scrolled. */
  problem?: string;
  /** Offered with a save failure: the record may have changed on the server. */
  onReload?: () => void;
  cancel: Action;
  secondary?: Action;
  primary?: Action;
};

/** On phones the main action gets its own full-width row, so a long label is never cut. */
const DoseModalFooter = ({ problem, onReload, cancel, secondary, primary }: Props) => {
  const { isMobile } = useResponsive();
  const button = (action: Action, variant: "primary" | "secondary", fill = false) => (
    <Button {...action} variant={variant} fullWidth={isMobile} style={fill ? styles.fill : undefined} />
  );
  const secondaries = (
    <>
      {button(cancel, "secondary", isMobile)}
      {secondary ? button(secondary, "secondary", isMobile) : null}
    </>
  );
  return (
    <View style={styles.footer}>
      {problem ? <ErrorBanner message={problem} /> : null}
      {onReload ? <Button label="Reload saved checklist" variant="text" onPress={onReload} /> : null}
      {isMobile ? (
        <View style={styles.footer}>
          {primary ? button(primary, "primary") : null}
          <View style={styles.row}>{secondaries}</View>
        </View>
      ) : (
        <View style={[styles.row, styles.end]}>
          {secondaries}
          {primary ? button(primary, "primary") : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: { gap: SPACING.sm },
  row: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  end: { justifyContent: "flex-end" },
  fill: { flexGrow: 1, flexBasis: 0 },
});

export default DoseModalFooter;
