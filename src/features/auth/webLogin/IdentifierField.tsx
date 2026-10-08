import type { RefObject } from "react";
import LoginField, { errorId } from "./LoginField";
import { MailIcon } from "./LoginIcons";
import s from "./webLogin.module.css";

const FIELD_ID = "mc-id";

type IdentifierFieldProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  error: string | null;
  busy: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
};

/** The sign-in email address; `inputMode="email"` puts @ and . on the phone keyboard. */
const IdentifierField = ({ inputRef, value, error, busy, onChange, onBlur }: IdentifierFieldProps) => (
  <LoginField
    id={FIELD_ID}
    label="Email address"
    icon={<MailIcon className={`${s.fieldIcon} ${s.fieldIconBrand}`} />}
    error={error}
    busy={busy}
  >
    <input
      ref={inputRef}
      id={FIELD_ID}
      className={s.input}
      name="username"
      type="text"
      inputMode="email"
      autoComplete="username"
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      placeholder="juan@email.com"
      value={value}
      readOnly={busy}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? errorId(FIELD_ID) : undefined}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
    />
  </LoginField>
);

export default IdentifierField;
