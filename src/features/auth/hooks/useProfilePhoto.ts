import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { showAlert } from "@/utils/notify";

/**
 * The chosen photo, as a base64 data URI.
 *
 * Stored inline rather than as a file path because the record is kept in
 * MongoDB: a local filesystem URI would be meaningless to the server and
 * unreadable from any other device.
 */
function toDataUri(asset: ImagePicker.ImagePickerAsset): string | null {
  if (!asset.base64) return null;
  const rawType = asset.type ? String(asset.type) : "";
  const mime =
    asset.mimeType || (rawType ? (rawType.includes("/") ? rawType : `image/${rawType}`) : "image/jpeg");
  return `data:${mime};base64,${asset.base64}`;
}

const PICKER_OPTIONS = {
  allowsEditing: true,
  aspect: [1, 1] as [number, number],
  quality: 0.8,
  base64: true,
};

/**
 * Choosing a profile photo from the camera or the gallery.
 *
 * Both routes end the same way — permission, pick, encode — so they share
 * everything but the permission request and the picker they call.
 */
export function useProfilePhoto(onPicked?: () => void) {
  const [photo, setPhoto] = useState<string | null>(null);

  const applyResult = useCallback(
    (result: ImagePicker.ImagePickerResult) => {
      if (result.canceled || !result.assets[0]) return;

      const dataUri = toDataUri(result.assets[0]);
      if (!dataUri) {
        showAlert("Error", "Could not read image data. Please try a different photo.");
        return;
      }

      setPhoto(dataUri);
      onPicked?.();
    },
    [onPicked]
  );

  const pickFromGallery = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showAlert(
          "Permission needed",
          "Please grant camera roll permissions to upload a profile photo."
        );
        return;
      }
      applyResult(
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          ...PICKER_OPTIONS,
        })
      );
    } catch {
      showAlert("Photo Error", "Failed to pick the image. Please try again.");
    }
  }, [applyResult]);

  const takePhoto = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        showAlert("Permission needed", "Please grant camera permissions to take a photo.");
        return;
      }
      applyResult(await ImagePicker.launchCameraAsync(PICKER_OPTIONS));
    } catch {
      showAlert("Camera Error", "Failed to take the photo. Please try again.");
    }
  }, [applyResult]);

  const choosePhoto = useCallback(() => {
    showAlert("Profile Photo", "Choose a photo for your profile", [
      { text: "Cancel", style: "cancel" },
      { text: "Take Photo", onPress: () => void takePhoto() },
      { text: "Choose from Gallery", onPress: () => void pickFromGallery() },
    ]);
  }, [takePhoto, pickFromGallery]);

  return { photo, setPhoto, choosePhoto };
}
