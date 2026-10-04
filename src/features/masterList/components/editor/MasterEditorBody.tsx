import type { EditorStepProps } from "./editorLayout";
import MasterAddressStep from "./MasterAddressStep";
import MasterDetailsStep from "./MasterDetailsStep";
import MasterNameStep from "./MasterNameStep";
import MasterReviewStep from "./MasterReviewStep";

const MasterEditorBody = (props: EditorStepProps) => {
  switch (props.form.step.key) {
    case "name":
      return <MasterNameStep {...props} />;
    case "details":
      return <MasterDetailsStep {...props} />;
    case "address":
      return <MasterAddressStep {...props} />;
    case "review":
      return <MasterReviewStep {...props} />;
  }
};

export default MasterEditorBody;
