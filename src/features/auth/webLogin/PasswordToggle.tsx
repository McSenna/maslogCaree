import { EyeIcon, EyeOffIcon } from "./LoginIcons";
import s from "./webLogin.module.css";

type PasswordToggleProps = { controls: string; shown: boolean; onToggle: () => void };

/** 44 x 44 so it is an easy tap target even though the eye itself is 22px. */
const PasswordToggle = ({ controls, shown, onToggle }: PasswordToggleProps) => (
  <button
    type="button"
    className={s.toggle}
    aria-label={shown ? "Hide password" : "Show password"}
    aria-pressed={shown}
    aria-controls={controls}
    onClick={onToggle}
  >
    {shown ? <EyeIcon className={s.toggleIcon} /> : <EyeOffIcon className={s.toggleIcon} />}
  </button>
);

export default PasswordToggle;
