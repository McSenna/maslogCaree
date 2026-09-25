import type { ReactNode } from "react";
import { Text, View } from "react-native";
import Card from "@/components/cards/Card";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SPACING } from "@/theme/spacing";
import { TYPE } from "@/theme/typography";

type WorkspacePanelProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const WorkspacePanel = ({ title, subtitle, children }: WorkspacePanelProps) => {
  const colors = useThemeColors();

  return (
    <Card elevated={false} style={{ gap: SPACING.md }}>
      <View style={{ gap: 2 }}>
        <Text accessibilityRole="header" style={[TYPE.title, { color: colors.heading }]}>
          {title}
        </Text>
        {subtitle ? <Text style={[TYPE.caption, { color: colors.muted }]}>{subtitle}</Text> : null}
      </View>
      {children}
    </Card>
  );
};

export const PanelEmpty = ({ children }: { children: string }) => {
  const colors = useThemeColors();
  return <Text style={[TYPE.body, { color: colors.muted }]}>{children}</Text>;
};

export default WorkspacePanel;
