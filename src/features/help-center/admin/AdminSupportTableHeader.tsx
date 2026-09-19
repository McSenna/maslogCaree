import { Text, View } from "react-native";

import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { SUPPORT_TABLE_HEADERS } from "./adminSupportTableColumns";

const AdminSupportTableHeader = () => {
  const palette = useAdminSurfacePalette();

  return (
    <View
      className="w-full flex-row items-center"
      style={{
        width: "100%",
        minHeight: 46,
        borderBottomWidth: 1,
        borderBottomColor: palette.divider,
        backgroundColor: palette.subtleSurface,
      }}
    >
      {SUPPORT_TABLE_HEADERS.map((column) => {
        const isRight = "align" in column && column.align === "right";
        const isCenter = "align" in column && column.align === "center";

        return (
          <View
            key={column.key}
            style={{
              width: "width" in column ? column.width : undefined,
              flex: "flex" in column ? column.flex : undefined,
              minWidth: column.minWidth,
              paddingHorizontal: 12,
              alignItems: isRight ? "flex-end" : isCenter ? "center" : "flex-start",
              justifyContent: "center",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 11.5,
                fontWeight: "700",
                color: palette.subtle,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                textAlign: isRight ? "right" : isCenter ? "center" : "left",
              }}
            >
              {column.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default AdminSupportTableHeader;
