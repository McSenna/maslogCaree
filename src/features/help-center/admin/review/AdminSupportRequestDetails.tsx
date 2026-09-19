import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { RADIUS } from "@/design/adminSurfaces";
import { useAdminSurfacePalette } from "@/design/useAdminSurfacePalette";

import { fileExtensionOf, formatFileSize } from "../../utils/support.utils";
import type { SupportAttachment } from "../../types/support.types";

type AdminSupportRequestDetailsProps = {
  subject: string;
  description: string;
  attachments: SupportAttachment[];
};

const AdminSupportRequestDetails = ({
  subject,
  description,
  attachments,
}: AdminSupportRequestDetailsProps) => {
  const palette = useAdminSurfacePalette();

  return (
    <View style={{ gap: 14 }}>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 11.5, fontWeight: "700", color: palette.subtle, letterSpacing: 0.4, textTransform: "uppercase" }}>
          Subject
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "700", color: palette.heading, lineHeight: 22 }}>
          {subject}
        </Text>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ fontSize: 11.5, fontWeight: "700", color: palette.subtle, letterSpacing: 0.4, textTransform: "uppercase" }}>
          Description
        </Text>
        <View
          style={{
            padding: 14,
            borderRadius: RADIUS.panel,
            backgroundColor: palette.subtleSurface,
            borderWidth: 1,
            borderColor: palette.cardBorder,
          }}
        >
          <Text style={{ fontSize: 13.5, lineHeight: 21, color: palette.body }}>
            {description}
          </Text>
        </View>
      </View>

      {attachments.length > 0 ? (
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 11.5, fontWeight: "700", color: palette.subtle, letterSpacing: 0.4, textTransform: "uppercase" }}>
            Attachments ({attachments.length})
          </Text>
          <View style={{ gap: 8 }}>
            {attachments.map((file) => {
              const ext = fileExtensionOf(file.fileName).toUpperCase() || "FILE";
              return (
                <View
                  key={file.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    padding: 10,
                    borderRadius: RADIUS.control,
                    backgroundColor: palette.cardBg,
                    borderWidth: 1,
                    borderColor: palette.cardBorder,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: palette.isDark ? "rgba(99, 102, 241, 0.14)" : "#EEF2FF",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather
                      name={ext === "PDF" ? "file-text" : "image"}
                      size={16}
                      color={palette.primary}
                    />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text numberOfLines={1} style={{ fontSize: 13, fontWeight: "600", color: palette.heading }}>
                      {file.fileName}
                    </Text>
                    <Text style={{ fontSize: 11.5, color: palette.muted }}>
                      {ext} · {formatFileSize(file.fileSize)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default AdminSupportRequestDetails;
