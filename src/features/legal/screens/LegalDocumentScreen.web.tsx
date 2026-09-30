import { useRouter } from "expo-router";
import Head from "expo-router/head";

import LegalDocumentDialog from "../components/LegalDocumentDialog";
import { LEGAL_DOCUMENTS } from "../legalContent";

/**
 * `/privacy` and `/terms` opened directly on web (a shared link or a refresh):
 * the same centred dialog the in-app links open. Closing goes back, or to the
 * login page when this was the first page of the visit.
 */
const LegalDocumentScreen = ({ kind }: { kind: keyof typeof LEGAL_DOCUMENTS }) => {
  const router = useRouter();

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  return (
    <>
      <Head>
        <title>{`${LEGAL_DOCUMENTS[kind].title} · MaslogCare`}</title>
      </Head>
      <LegalDocumentDialog kind={kind} onClose={close} />
    </>
  );
};

export default LegalDocumentScreen;
