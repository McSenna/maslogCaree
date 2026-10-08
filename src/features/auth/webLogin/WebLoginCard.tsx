import { useRef, type FormEvent } from "react";
import { SECURITY_NOTICE } from "@/config/landingContent";
import ForgotPasswordFlow from "../forgotPassword/ForgotPasswordFlow";
import PlatformAccessModal from "../components/PlatformAccessModal";
import IdentifierField from "./IdentifierField";
import { ShieldCheckIcon } from "./LoginIcons";
import LoginSuccess from "./LoginSuccess";
import PasswordField from "./PasswordField";
import { useWebLogin } from "./useWebLogin";
import WebLoginCardHeader from "./WebLoginCardHeader";
import s from "./webLogin.module.css";

type WebLoginCardProps = {
  onOpenRegister: () => void;
  entranceStyle?: { animationDelay: string };
};

const WebLoginCard = ({ onOpenRegister, entranceStyle }: WebLoginCardProps) => {
  const form = useWebLogin();
  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const busy = form.status !== "idle";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = await form.submit();
    if (invalid === "identifier") identifierRef.current?.focus();
    if (invalid === "password") passwordRef.current?.focus();
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
          <IdentifierField
            inputRef={identifierRef}
            value={form.identifier}
            error={form.errors.identifier}
            busy={busy}
            onChange={form.setIdentifier}
            onBlur={form.validateIdentifierOnBlur}
          />
          <PasswordField
            inputRef={passwordRef}
            value={form.password}
            error={form.errors.password}
            busy={busy}
            onChange={form.setPassword}
          />
        </div>

        <button type="submit" className={`${s.button} ${s.buttonPrimary}`} aria-disabled={busy || undefined}>
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

        <button type="button" className={`${s.button} ${s.buttonSecondary}`} onClick={onOpenRegister}>
          Create new account
        </button>

        <p className={s.srOnly} role="status">
          {form.status === "submitting" ? "Logging in…" : ""}
        </p>

        <p className={s.security}>
          <ShieldCheckIcon className={s.securityIcon} />
          {SECURITY_NOTICE}
        </p>
      </form>

      {form.status === "success" ? <LoginSuccess message={form.successMessage} /> : null}

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
