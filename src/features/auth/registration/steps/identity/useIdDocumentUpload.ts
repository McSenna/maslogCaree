import { useCallback, useRef, useState } from "react";
import { Platform } from "react-native";

import { showAlert } from "@/utils/notify";
import type { RegistrationController } from "../../useResidentRegistration";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "./idDocumentFormat";
import { captureIdPhoto, pickImageFromGallery } from "./nativeIdPickers";

export const useIdDocumentUpload = (form: RegistrationController) => {
  const { setField } = form;
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDocumentSelected = useCallback(
    (base64DataUri: string, fileName: string, mimeType: string, fileSize: number) => {
      if (fileSize > MAX_FILE_SIZE_BYTES) {
        showAlert(
          "File Too Large",
          "The selected file exceeds the 10MB limit. Please choose a smaller image or compressed PDF."
        );
        return;
      }

      const cleanMime = mimeType.toLowerCase();
      const isAllowed =
        ALLOWED_MIME_TYPES.includes(cleanMime) ||
        cleanMime.startsWith("image/") ||
        cleanMime === "application/pdf";

      if (!isAllowed) {
        showAlert(
          "Unsupported Format",
          "Only JPG, JPEG, PNG, and PDF files are accepted for identity verification."
        );
        return;
      }

      setField("idDocument", base64DataUri);
      setField("idFileName", fileName);
      setField("idMimeType", cleanMime);
      form.setField("idFileSize" as any, String(fileSize));
    },
    [setField, form]
  );

  const handleWebFileChange = (e: any) => {
    const file = e?.target?.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      handleDocumentSelected(result, file.name, file.type || "application/octet-stream", file.size);
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    reader.onerror = () => {
      setIsProcessingFile(false);
      showAlert("Read Error", "Could not read the selected file. Please try another.");
    };

    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    if (Platform.OS === "web") {
      fileInputRef.current?.click();
      return;
    }

    const pickerContext = {
      onSelected: handleDocumentSelected,
      setProcessing: setIsProcessingFile,
    };

    showAlert("Upload Government ID", "Choose an option to provide your identification", [
      { text: "Cancel", style: "cancel" },
      { text: "Take Photo", onPress: () => void captureIdPhoto(pickerContext) },
      { text: "Choose from Gallery", onPress: () => void pickImageFromGallery(pickerContext) },
    ]);
  };

  const handleRemoveDocument = () => {
    setField("idDocument", "");
    setField("idFileName", "");
    setField("idMimeType", "");
    form.setField("idFileSize" as any, "0");
  };

  return {
    fileInputRef,
    isProcessingFile,
    handleWebFileChange,
    triggerUpload,
    handleRemoveDocument,
  };
};
