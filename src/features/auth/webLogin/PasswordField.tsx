import { useState, type KeyboardEvent, type RefObject } from "react";
import { PASSWORD_MAX_LENGTH } from "../forgotPassword/passwordRules";
import LoginField, { errorId } from "./LoginField";
import { LockIcon } from "./LoginIcons";
import PasswordToggle from "./PasswordToggle";
import s from "./webLogin.module.css";

const FIELD_ID = "mc-pw";
const CAPS_HINT_ID = "mc-caps";

type PasswordFieldProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  value: string;
  error: string | null;
  busy: boolean;
  onChange: (value: string) => void;
};

const describedBy = (...ids: (string | false | null)[]) => ids.filter(Boolean).join(" ") || undefined;

/** Password with a show/hide toggle and a Caps Lock warning while it is focused. */
const PasswordField = ({ inputRef, value, error, busy, onChange }: PasswordFieldProps) => {
  const [shown, setShown] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  // Updated only by keys typed here, never cleared on blur: hiding it on blur shrank the
  // card under the pointer, so pressing Log in while it showed missed the button.
  const trackCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(event.getModifierState("CapsLock"));
  };

  return (
    <LoginField
      id={FIELD_ID}
      label="Password"
      icon={<LockIcon className={s.fieldIcon} />}
      error={error}
      busy={busy}
      trailing={<PasswordToggle controls={FIELD_ID} shown={shown} onToggle={() => setShown((now) => !now)} />}
      footer={
        <p id={CAPS_HINT_ID} className={s.capsHint} aria-live="polite">
          {capsLock ? "Caps Lock is on." : ""}
        </p>
      }
    >
      <input
        ref={inputRef}
        id={FIELD_ID}
        className={s.input}
        name="password"
        type={shown ? "text" : "password"}
        autoComplete="current-password"
        maxLength={PASSWORD_MAX_LENGTH}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        placeholder="Enter your password"
        value={value}
        readOnly={busy}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(error && errorId(FIELD_ID), capsLock && CAPS_HINT_ID)}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={trackCapsLock}
        onKeyUp={trackCapsLock}
      />
    </LoginField>
  );
};

export default PasswordField;
