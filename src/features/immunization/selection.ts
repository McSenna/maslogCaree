import { subscribeToLogout } from "@/services/authEvents";
import { clearImmunizationSelection } from "./selectionStore";
subscribeToLogout(clearImmunizationSelection);
export {
  getImmunizationSelection,
  getChecklistRequestVersion,
  getImmunizationEditorRequest,
  clearImmunizationEditorRequest,
  requestImmunizationChecklist,
  subscribeImmunizationSelection,
  openImmunizationBaby,
  clearImmunizationSelection,
} from "./selectionStore";
