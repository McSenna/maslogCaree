import { useEffect, useState, useSyncExternalStore } from "react";
import Head from "expo-router/head";
import { setToastPlacement } from "@/components/feedback/toast/toastStore";
import { landingAssets } from "@/config/landingAssets";
import {
  LANDING_CONTENT,
  LANDING_FEATURE_COPY,
  type LandingFeatureCopy,
} from "@/config/landingContent";
import {
  ArrowRightIcon,
  BellIcon,
  CalendarClockIcon,
  InfoIcon,
  PinIcon,
  StethoscopeIcon,
} from "./LoginIcons";
import WebLoginCard from "./WebLoginCard";
import s from "./webLogin.module.css";

type WebLoginPageProps = {
  onOpenRegister: () => void;
  onOpenLearnMore: () => void;
};

const FEATURE_VISUALS: Record<LandingFeatureCopy["key"], { Icon: typeof BellIcon; tone: string }> = {
  request: { Icon: CalendarClockIcon, tone: s.toneBlue },
  priority: { Icon: StethoscopeIcon, tone: s.toneGreen },
  schedule: { Icon: BellIcon, tone: s.toneOrange },
};

const FEATURES = LANDING_FEATURE_COPY.map((copy) => ({ ...copy, ...FEATURE_VISUALS[copy.key] }));

// On web a required image is either a URL string or an object carrying one.
const assetUri = (source: unknown): string | undefined => {
  if (typeof source === "string") return source;
  if (source && typeof source === "object" && "uri" in source) return String(source.uri);
  return undefined;
};

const SEAL_SRC = assetUri(landingAssets.brandMark);
const PHOTO_SRC = assetUri(landingAssets.barangayBackground);

const subscribe = () => () => {};

const ENTRANCE_MS = 400;

const useEntranceStyle = () => {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const [style] = useState(() => {
    // Returning nothing while hydrating keeps the markup identical to the server's.
    if (!isClient) return undefined;
    const painted = document.querySelector<HTMLElement>("[data-login-card]");
    if (!painted) return undefined;
    const elapsed = Number(painted.getAnimations()[0]?.currentTime ?? ENTRANCE_MS);
    return { animationDelay: `-${Math.round(Math.min(elapsed, ENTRANCE_MS))}ms` };
  });
  return style;
};

const Waves = () => (
  // The viewBox crops the mockup's 1448 x 1086 artboard to the waves, so CSS sizes them on their own.
  <svg className={s.waves} viewBox="0 928 760 158" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path
      fill="#C9DBFB"
      d="M0 944C40 938 70 932 100 933C150 935 190 955 230 968C255 977 270 986 290 989C320 993 345 975 380 966C410 959 440 960 470 968C510 979 545 990 570 1002C588 1012 596 1040 600 1086H0Z"
    />
    <path
      fill="#8FB5F8"
      d="M0 948C30 942 60 936 92 935C130 934 160 950 190 966C220 983 240 998 270 1003C310 1008 350 1000 400 997C450 994 500 1000 540 1004C580 1008 610 1020 640 1040C680 1066 715 1080 760 1086H0Z"
    />
    <path
      fill="#5B93F5"
      d="M0 996C40 986 90 970 140 966C170 964 190 968 210 978C240 993 270 1006 300 1016C330 1026 360 1032 400 1040C450 1050 495 1070 540 1086H0Z"
    />
  </svg>
);

// Phones only: two soft waves that settle the hazed hall into the page color above the card.
const Mist = () => (
  <svg className={s.mist} viewBox="0 0 390 110" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path fill="#f2f6fe" opacity="0.8" d="M240 110C280 70 335 40 390 34V110Z" />
    <path fill="#f2f6fe" d="M120 110C140 80 170 60 205 52C235 45 260 41 282 42C320 44 360 62 390 76V110Z" />
    <path fill="#f2f6fe" d="M0 6C8 1 16 0 24 0C46 1 70 16 100 38C122 54 140 66 160 76C178 86 196 98 214 110H0Z" />
  </svg>
);

const WebLoginPage = ({ onOpenRegister, onOpenLearnMore }: WebLoginPageProps) => {
  const entranceStyle = useEntranceStyle();

  // Login failures arrive as toasts; at the top they never cover Forgotten password or Create an account.
  useEffect(() => {
    setToastPlacement("top");
    return () => setToastPlacement("bottom");
  }, []);

  return (
    <div className={s.page}>
      <Head>
        <title>Log in · MaslogCare</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&display=swap"
        />
      </Head>

      <div className={s.stage}>
        <main className={s.frame}>
          <div className={s.scenery} aria-hidden="true">
            {PHOTO_SRC ? <img className={s.photo} src={PHOTO_SRC} alt="" decoding="async" /> : null}
            <div className={s.tint} />
            <div className={s.haze} />
            <Mist />
            <Waves />
          </div>

          <section className={s.intro} aria-label="About MaslogCare">
            <div className={s.brand}>
              {SEAL_SRC ? (
                <img className={s.seal} src={SEAL_SRC} alt="Barangay 61 Maslog, Legazpi City seal" />
              ) : null}
              <div className={s.brandText}>
                <p className={s.wordmark}>
                  <span className={s.wordmarkDark}>Maslog</span>
                  <span className={s.wordmarkBlue}>Care</span>
                </p>
                <p className={s.tagline}>
                  Barangay Appointment &amp; <span className={s.nowrap}>Healthcare System</span>
                </p>
              </div>
            </div>

            <p className={s.lede}>
              <strong className={s.ledeLead}>
                {LANDING_CONTENT.headline.lead} {LANDING_CONTENT.headline.accent}.
              </strong>{" "}
              {LANDING_CONTENT.description}
            </p>

            <div className={s.actions}>
              <button
                type="button"
                className={`${s.action} ${s.actionPrimary}`}
                aria-label="Get started: create a MaslogCare account"
                onClick={onOpenRegister}
              >
                {LANDING_CONTENT.actions.primary.label}
                <ArrowRightIcon className={s.actionIcon} />
              </button>
              <button
                type="button"
                className={`${s.action} ${s.actionSecondary}`}
                aria-label="Learn more about how MaslogCare works"
                aria-haspopup="dialog"
                onClick={onOpenLearnMore}
              >
                <InfoIcon className={s.actionIcon} />
                {LANDING_CONTENT.actions.secondary.label}
              </button>
            </div>
          </section>

          {/* Beside the intro on desktop; below the card on tablets and phones. */}
          <ul className={s.features} aria-label="What you can do with MaslogCare">
            {FEATURES.map(({ key, Icon, tone, title, description }) => (
              <li key={key} className={s.feature}>
                <span className={`${s.featureTile} ${tone}`}>
                  <Icon className={s.featureIcon} />
                </span>
                <span className={s.featureText}>
                  <strong className={s.featureTitle}>{title}</strong>
                  <span className={s.featureDescription}>{description}</span>
                </span>
              </li>
            ))}
          </ul>

          <WebLoginCard onOpenRegister={onOpenRegister} entranceStyle={entranceStyle} />

          <p className={s.place}>
            <PinIcon className={s.placeIcon} />
            Barangay 61 Maslog, Legazpi City
          </p>
        </main>
      </div>
    </div>
  );
};

export default WebLoginPage;
