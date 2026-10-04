import type { MasterResidentEditorState } from "../../hooks/useMasterResidentEditor";

/** Same metrics as the registration steps (see auth/registration/steps/stepLayout). */
export type EditorStepProps = {
  form: MasterResidentEditorState;
  inputHeight: number;
  twoColumn: boolean;
};
