let selectedBaby: string | null = null;
const listeners = new Set<() => void>();
export const getImmunizationSelection = () => selectedBaby;
export const subscribeImmunizationSelection = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const openImmunizationBaby = (babyId: string) => {
  selectedBaby = babyId;
  listeners.forEach((listener) => listener());
};
export const clearImmunizationSelection = () => {
  selectedBaby = null;
  editorRequested = false;
  listeners.forEach((listener) => listener());
};

let checklistRequestVersion = 0;
let editorRequested = false;
export const getImmunizationEditorRequest = () => editorRequested;
export const clearImmunizationEditorRequest = () => { editorRequested = false; };
export const getChecklistRequestVersion = () => checklistRequestVersion;
export const requestImmunizationChecklist = () => {
  editorRequested = true;
  checklistRequestVersion += 1;
  listeners.forEach((listener) => listener());
};
