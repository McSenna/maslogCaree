import * as ImagePicker from "expo-image-picker";

import { showAlert } from "@/utils/notify";

export type DocumentSelectedHandler = (
  base64DataUri: string,
  fileName: string,
  mimeType: string,
  fileSize: number
) => void;

type PickerContext = {
  onSelected: DocumentSelectedHandler;
  setProcessing: (processing: boolean) => void;
};

const estimateBase64Bytes = (base64: string) => Math.round((base64.length * 3) / 4);

const forwardAsset = (
  asset: ImagePicker.ImagePickerAsset,
  fallbackName: string,
  onSelected: DocumentSelectedHandler
) => {
  const mime = asset.mimeType || "image/jpeg";
  onSelected(
    `data:${mime};base64,${asset.base64}`,
    asset.fileName || fallbackName,
    mime,
    asset.fileSize || estimateBase64Bytes(asset.base64 as string)
  );
};

export const pickImageFromGallery = async ({ onSelected, setProcessing }: PickerContext) => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showAlert(
        "Permission Required",
        "Please grant media library permissions to upload your Government ID."
      );
      return;
    }

    setProcessing(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.85,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        forwardAsset(asset, `id_${Date.now()}.jpg`, onSelected);
      } else {
        showAlert("Upload Error", "Could not process image base64 data.");
      }
    }
  } catch {
    showAlert("Upload Error", "An error occurred while picking the ID image.");
  } finally {
    setProcessing(false);
  }
};

export const captureIdPhoto = async ({ onSelected, setProcessing }: PickerContext) => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      showAlert("Permission Required", "Please grant camera permissions to capture your ID.");
      return;
    }

    setProcessing(true);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.85,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        const mime = asset.mimeType || "image/jpeg";
        onSelected(
          `data:${mime};base64,${asset.base64}`,
          `camera_id_${Date.now()}.jpg`,
          mime,
          asset.fileSize || estimateBase64Bytes(asset.base64)
        );
      }
    }
  } catch {
    showAlert("Camera Error", "Failed to capture photo.");
  } finally {
    setProcessing(false);
  }
};
