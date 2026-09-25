import { useState } from "react";
import { Platform, View } from "react-native";

import FieldShell from "../../components/FieldShell";
import { REG_RADIUS } from "../../registrationTheme";
import type { RegistrationController } from "../../useResidentRegistration";
import IdImagePreview from "./IdImagePreview";
import IdPdfPreview from "./IdPdfPreview";
import IdPreviewActions from "./IdPreviewActions";
import IdUploadDropzone from "./IdUploadDropzone";
import ImageZoomModal from "@/components/ui/ImageZoomModal";
import { formatFileSize, isPdfDocument } from "./idDocumentFormat";
import { useIdDocumentUpload } from "./useIdDocumentUpload";

type Props = { form: RegistrationController };

const IdDocumentField = ({ form }: Props) => {
  const { values, errors } = form;
  const [previewZoomOpen, setPreviewZoomOpen] = useState(false);

  const {
    fileInputRef,
    isProcessingFile,
    handleWebFileChange,
    triggerUpload,
    handleRemoveDocument,
  } = useIdDocumentUpload(form);

  const isPdf = isPdfDocument(values);
  const formattedFileSize = formatFileSize(values.idFileSize);

  return (
    <>
      <FieldShell
        label="Upload Valid ID"
        required
        helper="Supported formats: JPG, JPEG, PNG, PDF (Max 10MB). Document must be clear, well-lit, and uncropped."
        error={errors.idDocument}
      >
        {Platform.OS === "web" && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,application/pdf"
            style={{ display: "none" }}
            onChange={handleWebFileChange}
          />
        )}

        {!values.idDocument ? (
          <IdUploadDropzone
            onPress={triggerUpload}
            isProcessing={isProcessingFile}
            hasError={Boolean(errors.idDocument)}
          />
        ) : (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#CBD5E1",
              borderRadius: REG_RADIUS.card,
              backgroundColor: "#FFFFFF",
              overflow: "hidden",
              boxShadow: "0px 2px 8px rgba(15,23,42,0.06)",
            }}
          >
            {isPdf ? (
              <IdPdfPreview
                fileName={values.idFileName}
                formattedFileSize={formattedFileSize}
              />
            ) : (
              <IdImagePreview
                uri={values.idDocument}
                formattedFileSize={formattedFileSize}
                onZoom={() => setPreviewZoomOpen(true)}
              />
            )}

            <IdPreviewActions onReplace={triggerUpload} onRemove={handleRemoveDocument} />
          </View>
        )}
      </FieldShell>

      {previewZoomOpen && !isPdf && (
        <ImageZoomModal
          visible={previewZoomOpen}
          uri={values.idDocument}
          onClose={() => setPreviewZoomOpen(false)}
          accessibilityLabel="Your government ID, enlarged"
          maxImageWidth={800}
        />
      )}
    </>
  );
};

export default IdDocumentField;
