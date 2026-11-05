import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { PageSubtitle, PageTitle } from "@/components/ui/Typography";
import { useResponsive } from "@/hooks/useResponsive";
import { SPACING } from "@/theme/spacing";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  /** Show only the actions; the title stays for screen readers. */
  hideHeading?: boolean;
};

const PageHeader = ({ title, subtitle, actions, hideHeading = false }: PageHeaderProps) => {
  const { isMobile } = useResponsive();

  if (hideHeading) {
    return (
      <View style={isMobile ? { gap: SPACING.sm } : { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", gap: SPACING.sm }}>
        <Text role="heading" aria-level={1} className="sr-only">{title}</Text>
        {actions}
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "flex-end",
        justifyContent: "space-between",
        gap: isMobile ? SPACING.md : SPACING.lg,
      }}
    >
      <View style={{ flex: isMobile ? undefined : 1, minWidth: 0 }}>
        <PageTitle>{title}</PageTitle>
        {subtitle ? <PageSubtitle>{subtitle}</PageSubtitle> : null}
      </View>
      {actions ? (
        <View style={isMobile ? { gap: SPACING.sm } : { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm }}>
          {actions}
        </View>
      ) : null}
    </View>
  );
};

export default PageHeader;
