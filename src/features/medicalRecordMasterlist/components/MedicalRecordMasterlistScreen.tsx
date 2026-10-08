import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";

import RoleScreenBackdrop from "@/components/layout/RoleScreenBackdrop";
import { getSidebarWidth } from "@/components/navigation/sidebar/sidebarTheme";
import { useUsersTheme } from "@/features/users/admin/useUsersTheme";
import { useResponsive } from "@/hooks/useResponsive";
import { useRoleScreenInsets } from "@/hooks/useRoleScreenInsets";

import { useMasterlistScreen } from "../hooks/useMasterlistScreen";
import MasterlistOverlays from "./MasterlistOverlays";
import MasterlistPhoneList from "./MasterlistPhoneList";
import MasterlistWideList from "./MasterlistWideList";

const SHELL_PADDING_X = 48;
const TABLE_MIN_WIDTH = 760;

const MedicalRecordMasterlistScreen = () => {
  const theme = useUsersTheme();
  const insets = useRoleScreenInsets();
  const { isMobile, width: windowWidth, breakpoint } = useResponsive();
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  const screen = useMasterlistScreen({ isPhone: isMobile });

  const width = measuredWidth ?? windowWidth - getSidebarWidth(breakpoint) - SHELL_PADDING_X;
  const wide = !isMobile && width - insets.gutter * 2 >= TABLE_MIN_WIDTH;

  const handleLayout = (event: LayoutChangeEvent) => setMeasuredWidth(event.nativeEvent.layout.width);

  return (
    <View style={theme.vars} onLayout={handleLayout} className="w-full flex-1">
      <RoleScreenBackdrop color={theme.palette.page} insets={insets} />
      {wide ? <MasterlistWideList screen={screen} width={width} insets={insets} /> : <MasterlistPhoneList screen={screen} width={width} />}
      <MasterlistOverlays screen={screen} />
    </View>
  );
};

export default MedicalRecordMasterlistScreen;
