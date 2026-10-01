import s from "./webLogin.module.css";

/** The greeting and what to do, centred above the first field. */
const WebLoginCardHeader = () => (
  <header className={s.cardHeader}>
    <h1 id="login-title" className={s.title}>
      Welcome back
    </h1>
    <p id="login-subtitle" className={s.subtitle}>
      Sign in to continue to MaslogCare
    </p>
  </header>
);

export default WebLoginCardHeader;
