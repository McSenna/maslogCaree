import * as DocumentPicker from "expo-document-picker";
import { Platform } from "react-native";

import { SUPPORT_LIMITS } from "../constants/support.constants";

export type PickedSupportFile = {
  fileName: string;
  mimeType: string;
  fileSize: number;
  data: string;
};

const readAsBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.readAsDataURL(blob);
  });
};

export const pickSupportAttachment = async (): Promise<PickedSupportFile | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: [...SUPPORT_LIMITS.allowedMimes],
    copyToCacheDirectory: Platform.OS !== "web",
    multiple: false,
  });

  const asset = result.canceled ? null : result.assets?.[0];
  if (!asset) return null;

  return {
    fileName: asset.name || "attachment",
    mimeType: asset.mimeType || "application/octet-stream",
    fileSize: asset.size ?? 0,
    data: await readAsBase64(asset.uri),
  };
};
