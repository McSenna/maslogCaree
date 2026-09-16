import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import api from "@/services/api";
import { getApiErrorMessage } from "@/utils/apiErrorHandler";

export type IdDocumentState = {
  uri: string | null;
  loading: boolean;
  error: string | null;
  canOpenExternally: boolean;
};

const readAsDataUri = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the ID document."));
    reader.onloadend = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read the ID document."));
    };
    reader.readAsDataURL(blob);
  });
};

export const useIdDocument = (verificationId: string | null | undefined): IdDocumentState => {
  const [uri, setUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const releasePrevious = () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };

    if (!verificationId) {
      releasePrevious();
      setUri(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    releasePrevious();
    setUri(null);
    setError(null);
    setLoading(true);

    (async () => {
      try {
        const { data } = await api.get<Blob>(
          `/admin/user-requests/${verificationId}/document`,
          { responseType: "blob" }
        );

        if (Platform.OS === "web") {
          const objectUrl = URL.createObjectURL(data);
          if (cancelled) {
            URL.revokeObjectURL(objectUrl);
            return;
          }
          objectUrlRef.current = objectUrl;
          setUri(objectUrl);
        } else {
          const dataUri = await readAsDataUri(data);
          if (cancelled) return;
          setUri(dataUri);
        }
      } catch (err) {
        if (cancelled) return;
        setError(getApiErrorMessage(err, "The ID document could not be loaded."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      releasePrevious();
    };
  }, [verificationId]);

  return {
    uri,
    loading,
    error,
    canOpenExternally: Platform.OS === "web" && uri !== null,
  };
};
