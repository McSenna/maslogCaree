import { useEffect, useState } from "react";

import {
  getIdTypesAndReasons,
  type IdTypeOption,
} from "@/features/users/services/userRequestsService";
import { DEFAULT_ID_TYPES } from "../../registrationOptions";
import { reportError } from "@/utils/errorReporting";

export type IdTypeChoice = { value: string; label: string };

export const useIdTypeOptions = () => {
  const [idTypeOptions, setIdTypeOptions] =
    useState<readonly IdTypeChoice[]>(DEFAULT_ID_TYPES);
  const [loadingConfig, setLoadingConfig] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadIdTypes = async () => {
      try {
        setLoadingConfig(true);
        const data = await getIdTypesAndReasons();
        if (mounted && data.idTypes && data.idTypes.length > 0) {
          setIdTypeOptions(
            data.idTypes.map((type: IdTypeOption) => ({
              value: type.id,
              label: type.label,
            }))
          );
        }
      } catch (error: unknown) {
        // The built-in ID types still cover registration, so this stays off screen.
        reportError("ID types not loaded", error);
      } finally {
        if (mounted) setLoadingConfig(false);
      }
    };

    void loadIdTypes();
    return () => {
      mounted = false;
    };
  }, []);

  return { idTypeOptions, loadingConfig };
};
