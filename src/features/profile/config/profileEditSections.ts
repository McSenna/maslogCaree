export type ProfileEditSection = "personal" | "contact";

export type EditProfileValues = {
  firstName: string;
  middleName: string;
  surname: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  address: string;
};

export type EditProfileField = keyof EditProfileValues;

export const EMPTY_EDIT_PROFILE_VALUES: EditProfileValues = {
  firstName: "",
  middleName: "",
  surname: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  address: "",
};

export const PROFILE_EDIT_SECTION_FIELDS: Record<ProfileEditSection, EditProfileField[]> = {
  personal: ["firstName", "middleName", "surname", "dateOfBirth", "gender"],
  contact: ["phone", "address"],
};

export const PROFILE_EDIT_SECTION_COPY: Record<
  ProfileEditSection,
  { noun: string; success: string }
> = {
  personal: {
    noun: "personal information",
    success: "Personal information updated successfully.",
  },
  contact: {
    noun: "contact information",
    success: "Contact information updated successfully.",
  },
};

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

export const isProfileEditSection = (key: string): key is ProfileEditSection =>
  key === "personal" || key === "contact";
