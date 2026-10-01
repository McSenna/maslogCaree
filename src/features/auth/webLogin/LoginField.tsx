import type { ReactNode } from "react";
import { AlertCircleIcon } from "./LoginIcons";
import s from "./webLogin.module.css";

type LoginFieldProps = {
  id: string;
  label: string;
  icon: ReactNode;
  error: string | null;
  busy: boolean;
  /** The input itself; it must use `id` and point `aria-describedby` at `errorId(id)` when invalid. */
  children: ReactNode;
  /** Placed inside the box after the input, such as the show-password button. */
  trailing?: ReactNode;
  /** Placed under the box and its error, such as the Caps Lock hint. */
  footer?: ReactNode;
};

const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");

export const errorId = (id: string) => `${id}-error`;

/**
 * A visible label above the box, the box, then its error. The error line is a
 * polite live region, so a message that appears on blur is read without
 * interrupting someone who is still tabbing through the form.
 */
const LoginField = ({ id, label, icon, error, busy, children, trailing, footer }: LoginFieldProps) => (
  <div className={s.fieldGroup}>
    <label htmlFor={id} className={cx(s.label, error && s.labelInvalid)}>
      {label}
    </label>
    <div className={cx(s.field, Boolean(trailing) && s.fieldWithToggle, error && s.fieldInvalid, busy && s.fieldBusy)}>
      {icon}
      {children}
      {trailing}
    </div>
    <p id={errorId(id)} className={s.fieldError} aria-live="polite">
      {error ? (
        <>
          <AlertCircleIcon className={s.fieldErrorIcon} />
          {error}
        </>
      ) : null}
    </p>
    {footer}
  </div>
);

export default LoginField;
