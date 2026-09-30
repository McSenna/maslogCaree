import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { SECURITY_NOTICE } from "@/config/landingContent";
import ForgotPasswordFlow from "../forgotPassword/ForgotPasswordFlow";
import PlatformAccessModal from "../components/PlatformAccessModal";
import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
} from "./LoginIcons";
import { useWebLogin } from "./useWebLogin";
import WebLoginCardHeader from "./WebLoginCardHeader";
import WebLoginLegalLinks from "./WebLoginLegalLinks";
import s from "./webLogin.module.css";

type WebLoginCardProps = {
  onOpenRegister: () => void;
  entranceStyle?: { animationDelay: string };
};

const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");

const WebLoginCard = ({ onOpenRegister, entranceStyle }: WebLoginCardProps) => {
  const form = useWebLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const busy = form.status !== "idle";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = await form.submit();
    if (invalid === "identifier") identifierRef.current?.focus();
    if (invalid === "password") passwordRef.current?.focus();
  };

  const trackCapsLock = (event: KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(event.getModifierState("CapsLock"));
  };

  return (
    <div className={s.card} style={entranceStyle} data-login-card>
      <form
        className={s.form}
        noValidate
        aria-labelledby="login-title"
        aria-describedby="login-subtitle"
        aria-busy={form.status === "submitting"}
        onSubmit={handleSubmit}
      >
        <WebLoginCardHeader />

        <div className={s.fields}>
          <div className={s.fieldGroup}>
            <div className={cx(s.field, form.errors.identifier && s.fieldInvalid)}>
              <MailIcon className={cx(s.fieldIcon, s.fieldIconBrand)} />
              <input
                ref={identifierRef}
                id="login-identifier"
                className={s.input}
                name="username"
                type="text"
                inputMode="email"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder=" "
                value={form.identifier}
                readOnly={busy}
                aria-invalid={Boolean(form.errors.identifier)}
                onChange={(event) => form.setIdentifier(event.target.value)}
                onBlur={form.validateIdentifierOnBlur}
              />
              <label htmlFor="login-identifier" className={s.label}>
                Email or mobile number
              </label>
            </div>
          </div>

          <div className={s.fieldGroup}>
            <div className={cx(s.field, s.fieldWithToggle, form.errors.password && s.fieldInvalid)}>
              <LockIcon className={s.fieldIcon} />
              <input
                ref={passwordRef}
                id="login-password"
                className={s.input}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder=" "
                value={form.password}
                readOnly={busy}
                aria-invalid={Boolean(form.errors.password)}
                aria-describedby={capsLock ? "login-caps-lock" : undefined}
                onChange={(event) => form.setPassword(event.target.value)}
                onKeyDown={trackCapsLock}
                onKeyUp={trackCapsLock}
                onBlur={() => setCapsLock(false)}
              />
              <label htmlFor="login-password" className={s.label}>
                Password
              </label>
              <button
                type="button"
                className={s.toggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                aria-controls="login-password"
                onClick={() => setShowPassword((shown) => !shown)}
              >
                {showPassword ? <EyeIcon className={s.toggleIcon} /> : <EyeOffIcon className={s.toggleIcon} />}
              </button>
            </div>
            <p id="login-caps-lock" className={s.capsHint} aria-live="polite">
              {capsLock ? "Caps Lock is on." : ""}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className={cx(s.button, s.buttonPrimary)}
          aria-disabled={busy || undefined}
        >
          {form.status === "submitting" ? (
            <>
              <span className={s.spinner} aria-hidden="true" />
              Logging in…
            </>
          ) : (
            "Log in"
          )}
        </button>

        <button type="button" className={s.link} onClick={form.openForgotPassword}>
          Forgotten password?
        </button>

        <div className={s.divider} role="presentation">
          <span className={s.dividerLine} />
          <span className={s.dividerText}>or</span>
          <span className={s.dividerLine} />
        </div>

        <button type="button" className={cx(s.button, s.buttonSecondary)} onClick={onOpenRegister}>
          Create an account
        </button>

        <p className={s.srOnly} role="status">
          {form.status === "submitting" ? "Logging in…" : ""}
        </p>

        <p className={s.security}>
          <ShieldCheckIcon className={s.securityIcon} />
          {SECURITY_NOTICE}
        </p>

        <WebLoginLegalLinks />
      </form>

      {form.status === "success" ? (
        <div className={s.success} role="status">
          <span className={s.successBadge}>
            <CheckIcon className={s.successIcon} />
          </span>
          <p className={s.successTitle}>You&apos;re signed in</p>
          <p className={s.successText}>Opening your dashboard…</p>
        </div>
      ) : null}

      <PlatformAccessModal visible={form.showPlatformNotice} onClose={form.dismissPlatformNotice} />
      <ForgotPasswordFlow
        visible={form.showForgotPassword}
        onClose={form.closeForgotPassword}
        initialEmail={form.identifier}
      />
    </div>
  );
};

export default WebLoginCard;
