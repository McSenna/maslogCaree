import s from "./webLogin.module.css";

/**
 * Three steps before the first field: which account this is, the greeting, then
 * what to enter. The rule under it closes the introduction off from the form.
 */
const WebLoginCardHeader = () => (
  <header className={s.cardHeader}>
    <p className={s.eyebrow}>MaslogCare account</p>
    <h1 id="login-title" className={s.title}>
      Welcome back
    </h1>
    <p id="login-subtitle" className={s.subtitle}>
      Sign in with your email or mobile number.
    </p>
  </header>
);

export default WebLoginCardHeader;
