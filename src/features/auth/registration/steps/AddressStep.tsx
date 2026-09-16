import { View } from "react-native";
import FormRow from "../components/FormRow";
import RegistrationInput from "../components/RegistrationInput";
import StepHeading from "../components/StepHeading";
import { STEP_SUBTITLES } from "../registrationOptions";
import type { StepProps } from "./stepLayout";

const AddressStep = ({ form, layout }: StepProps) => {
  const { values, errors, setField, blurField } = form;
  const { inputHeight, twoColumn } = layout;

  return (
    <View style={{ gap: 18 }}>
      <StepHeading title="Address Information" subtitle={STEP_SUBTITLES.address} />

      <FormRow twoColumn={twoColumn}>
        <RegistrationInput
          label="House No. / Purok / Sitio"
          optional
          icon="home"
          value={values.houseNumberOrPurok}
          onChangeText={(text) => setField("houseNumberOrPurok", text)}
          onBlur={() => blurField("houseNumberOrPurok")}
          placeholder="e.g. Purok 3, Blk 4 Lot 2"
          error={errors.houseNumberOrPurok}
          height={inputHeight}
          autoComplete="address-line1"
        />
        <RegistrationInput
          label="Street"
          optional
          icon="navigation"
          value={values.street}
          onChangeText={(text) => setField("street", text)}
          onBlur={() => blurField("street")}
          placeholder="e.g. Rizal Street"
          error={errors.street}
          height={inputHeight}
          autoComplete="address-line2"
        />
      </FormRow>

      <RegistrationInput
        label="Barangay"
        icon="map-pin"
        value={values.barangay}
        onChangeText={() => undefined}
        disabled
        helper="MaslogCare serves this barangay only, so this cannot be changed."
        height={inputHeight}
        accessibilityHint="Fixed for all residents"
      />

      <FormRow twoColumn={twoColumn}>
        <RegistrationInput
          label="City / Municipality"
          required
          icon="map"
          value={values.cityMunicipality}
          onChangeText={(text) => setField("cityMunicipality", text)}
          onBlur={() => blurField("cityMunicipality")}
          placeholder="Enter your city or municipality"
          error={errors.cityMunicipality}
          height={inputHeight}
          autoCapitalize="words"
        />
        <RegistrationInput
          label="Province"
          required
          icon="map"
          value={values.province}
          onChangeText={(text) => setField("province", text)}
          onBlur={() => blurField("province")}
          placeholder="Enter your province"
          error={errors.province}
          height={inputHeight}
          autoCapitalize="words"
        />
      </FormRow>
    </View>
  );
};

export default AddressStep;
