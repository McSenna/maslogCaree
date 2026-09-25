import { useState } from "react";
import { ActivityIndicator, Linking, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useIdDocument } from "../../hooks/useIdDocument";
import ImagePreview from "./idDocument/ImagePreview";
import PdfDocumentPreview from "./idDocument/PdfDocumentPreview";

export { formatFileSize } from "@/utils/fileSize";

type IdDocumentViewerProps = {
  verificationId: string | null;
  mimeType?: string;
  fileName?: string;
  fileSize?: number;
  height?: number;
};

const IdDocumentViewer = ({
  verificationId,
  mimeType,
  fileName,
  fileSize,
  height = 260,
}: IdDocumentViewerProps) => {
  const { classes } = useTheme();
  const [zoomOpen, setZoomOpen] = useState(false);

  const document = useIdDocument(verificationId);

  const isPdf =
    mimeType?.includes("pdf") || fileName?.toLowerCase().endsWith(".pdf") || false;

  const openExternally = () => {
    if (document.uri && document.canOpenExternally) void Linking.openURL(document.uri);
  };

  const frameClass =
    "rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800/70 items-center justify-center";

  if (document.loading) {
    return (
      <View className={frameClass} style={{ minHeight: height }}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className={`mt-2 text-[12px] ${classes.textMuted}`}>
          Loading secure document…
        </Text>
      </View>
    );
  }

  if (document.error || !document.uri) {
    return (
      <View className={frameClass} style={{ minHeight: height }}>
        <Feather name="alert-circle" size={28} color="#EF4444" />
        <Text className="mt-2 px-6 text-center text-[12.5px] font-semibold text-red-500">
          {document.error || "The ID document could not be loaded."}
        </Text>
      </View>
    );
  }

  if (isPdf) {
    return (
      <PdfDocumentPreview
        frameClass={frameClass}
        height={height}
        fileName={fileName}
        fileSize={fileSize}
        canOpenExternally={document.canOpenExternally}
        onOpenExternally={openExternally}
        textPrimary={classes.textPrimary}
        textMuted={classes.textMuted}
      />
    );
  }

  return (
    <ImagePreview
      frameClass={frameClass}
      height={height}
      uri={document.uri}
      canOpenExternally={document.canOpenExternally}
      onOpenExternally={openExternally}
      zoomOpen={zoomOpen}
      onOpenZoom={() => setZoomOpen(true)}
      onCloseZoom={() => setZoomOpen(false)}
    />
  );
};

export default IdDocumentViewer;
