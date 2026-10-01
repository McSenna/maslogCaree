import { useRouter, type Href } from "expo-router";
import Head from "expo-router/head";

import LegalDocumentDialog from "../components/LegalDocumentDialog";
import { LEGAL_CATALOG } from "../constants/legalCatalog";
import type { LegalDocumentKind } from "../types/legalDocument.types";

/**
 * `/privacy` and `/terms` opened directly on web (a shared link or a refresh):
 * the same centred dialog the in-app links open. Closing goes back, or to the
 * login page when this was the first page of the visit.
 */
const LegalDocumentScreen = ({ kind }: { kind: LegalDocumentKind }) => {
  const router = useRouter();

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  // Replace, not push: switching documents should not add a Back step.
  const openRelated = (next: LegalDocumentKind) => router.replace(LEGAL_CATALOG[next].route as Href);

  return (
    <>
      <Head>
        <title>{`${LEGAL_CATALOG[kind].title} · MaslogCare`}</title>
      </Head>
      <LegalDocumentDialog kind={kind} onClose={close} onOpenRelated={openRelated} />
    </>
  );
};

export default LegalDocumentScreen;
