import { SUPPORT_LIMITS } from "../constants/support.constants";
import { fileExtensionOf, formatFileSize } from "../utils/support.utils";
import type {
  SupportAttachmentDraft,
  SupportFormErrors,
  SupportFormValues,
} from "../types/support.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9+\-\s()]{7,20}$/;

const isAllowedMime = (mimeType: string) =>
  (SUPPORT_LIMITS.allowedMimes as readonly string[]).includes(mimeType);

const isAllowedExtension = (fileName: string) =>
  (SUPPORT_LIMITS.allowedExtensions as readonly string[]).includes(fileExtensionOf(fileName));

export const validateAttachment = (attachment: {
  fileName: string;
  mimeType: string;
  fileSize: number;
}): string | null => {
  if (!isAllowedExtension(attachment.fileName) || !isAllowedMime(attachment.mimeType)) {
    return "Only JPG, JPEG, PNG, and PDF files can be attached.";
  }
  if (attachment.fileSize > SUPPORT_LIMITS.maxAttachmentBytes) {
    return `Each file must be ${formatFileSize(SUPPORT_LIMITS.maxAttachmentBytes)} or smaller.`;
  }
  return null;
};

export const validateSupportForm = (
  values: SupportFormValues,
  attachments: SupportAttachmentDraft[] = []
): SupportFormErrors => {
  const errors: SupportFormErrors = {};
  const subject = values.subject.trim();
  const description = values.description.trim();
  const contactNumber = values.contactNumber.trim();

  if (!values.category) {
    errors.category = "Select the concern category that fits your request.";
  }
  if (subject.length < SUPPORT_LIMITS.subjectMin) {
    errors.subject = `Subject must be at least ${SUPPORT_LIMITS.subjectMin} characters.`;
  } else if (subject.length > SUPPORT_LIMITS.subjectMax) {
    errors.subject = `Subject must not exceed ${SUPPORT_LIMITS.subjectMax} characters.`;
  }
  if (description.length < SUPPORT_LIMITS.descriptionMin) {
    errors.description = `Please describe your concern in at least ${SUPPORT_LIMITS.descriptionMin} characters.`;
  } else if (description.length > SUPPORT_LIMITS.descriptionMax) {
    errors.description = `Description must not exceed ${SUPPORT_LIMITS.descriptionMax} characters.`;
  }
  if (!EMAIL_PATTERN.test(values.contactEmail.trim())) {
    errors.contactEmail = "A valid email address is required on your account.";
  }
  if (contactNumber.length > 0 && !PHONE_PATTERN.test(contactNumber)) {
    errors.contactNumber = "Enter a valid contact number.";
  }
  if (attachments.length > SUPPORT_LIMITS.maxAttachments) {
    errors.attachments = `You can attach up to ${SUPPORT_LIMITS.maxAttachments} files.`;
  }

  return errors;
};

export const hasSupportErrors = (errors: SupportFormErrors): boolean =>
  Object.values(errors).some(Boolean);
