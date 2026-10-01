import { CheckIcon } from "./LoginIcons";
import s from "./webLogin.module.css";

/** Covers the form while the dashboard loads, so nothing can be submitted twice. */
const LoginSuccess = ({ message }: { message: string }) => (
  <div className={s.success} role="status">
    <span className={s.successBadge}>
      <CheckIcon className={s.successIcon} />
    </span>
    <p className={s.successTitle}>You&apos;re signed in</p>
    <p className={s.successText}>{message}</p>
  </div>
);

export default LoginSuccess;
