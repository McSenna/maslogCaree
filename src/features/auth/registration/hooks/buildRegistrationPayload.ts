import type { RegisterPayload } from "@/services/auth";

import type { RegistrationValues } from "../registrationValidation";

export const buildRegistrationPayload = (
  values: RegistrationValues,
  profilePhoto: string | null,
  emailVerificationToken: string
): RegisterPayload => ({
  firstName: values.firstName,
  middleName: values.middleName,
  surname: values.surname,
  suffix: values.suffix,
  dateOfBirth: values.dateOfBirth,
  sex: values.sex,
  civilStatus: values.civilStatus,
  contactNumber: values.contactNumber,
  email: values.email,
  password: values.password,
  address: {
    houseNumberOrPurok: values.houseNumberOrPurok,
    street: values.street,
    barangay: values.barangay,
    cityMunicipality: values.cityMunicipality,
    province: values.province,
  },
  idType: values.idType,
  idNumber: values.idNumber,
  idDocument: values.idDocument,
  idFileName: values.idFileName,
  emailVerificationToken,
  ...(profilePhoto ? { profilePhoto } : {}),
});
