import { createContext, useContext } from "react";

import type { LinkChoice } from "./linkChoice";

type LinkChoiceState = { choice: LinkChoice; setChoice: (choice: LinkChoice) => void };

const LinkChoiceContext = createContext<LinkChoiceState | null>(null);

/** The review screen's link decision, read by the master list card and the approve confirmation. */
export const LinkChoiceProvider = LinkChoiceContext.Provider;

export const useLinkChoice = () => useContext(LinkChoiceContext);
