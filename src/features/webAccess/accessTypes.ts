import type { PortalState, WebOverride } from "../users/admin/userAdmin.types";

export interface GlobalWebPolicy {
  initialized: boolean;
  enabled: boolean;
  revision: number;
}
export interface ResidentWebAccess {
  override: WebOverride;
  globalEnabled: boolean;
  eligible: boolean;
  effective: boolean;
  state: PortalState;
  reason: string;
  revision: number;
}
