import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useCellSelfAlign } from "@/components/data-table";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";
import { TYPE } from "@/theme/typography";

import { portalAccessLines, type PortalTone } from "../../portalAccessDisplay";
import type { PortalState } from "../../userAdmin.types";

type Palette = ReturnType<typeof useAdminSurfacePalette>;

const toneColor = (palette: Palette, tone: PortalTone): string =>
  tone === "neutral" ? palette.body : palette.statusTones[tone].fg;

/** Icon and words, so access is never shown by colour alone. */
const PortalAccessCell = ({ state }: { state: PortalState }) => {
  const palette = useAdminSurfacePalette();
  const justifyContent = useCellSelfAlign();
  const { line1, line2, tone, icon, toneLine } = portalAccessLines(state);
  const color = toneColor(palette, tone);

  const line = (text: string, number: 1 | 2) => {
    const toned = toneLine === number;
    return (
      <View className="min-w-0 flex-row items-center gap-1" style={{ justifyContent }}>
        {toned ? <Feather name={icon} size={12} color={color} /> : null}
        <Text className="min-w-0 shrink" style={[TYPE.caption, { color: toned ? color : palette.muted }]}>{text}</Text>
      </View>
    );
  };

  return (
    <View className="min-w-0 gap-0.5 self-stretch">
      {line(line1, 1)}
      {line2 ? line(line2, 2) : null}
    </View>
  );
};

export default PortalAccessCell;
