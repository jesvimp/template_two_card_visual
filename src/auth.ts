// src/auth/msal.ts
import { PublicClientApplication, AccountInfo } from "@azure/msal-browser";

export type MsalConfig = {
  tenantId: string;
  spaClientId: string;
  apiScope: string;
  redirectUri?: string;
};

let pca: PublicClientApplication | null = null;

export function initMsal(cfg: MsalConfig) {
  pca = new PublicClientApplication({
    auth: {
      clientId: cfg.spaClientId,
      authority: `https://login.microsoftonline.com/${cfg.tenantId}`,
      redirectUri: cfg.redirectUri || "https://app.powerbi.com/"
    },
    cache: { cacheLocation: "sessionStorage" }
  });
}

export async function acquireApiToken(cfg: MsalConfig): Promise<string | null> {
  if (!pca) initMsal(cfg);
  const request = {
    scopes: [cfg.apiScope]
  };

  const accounts = pca!.getAllAccounts();
  const account: AccountInfo | undefined = accounts[0];

  try {
    const res = await pca!.acquireTokenSilent({ ...request, account });
    return res.accessToken;
  } catch {
    try {
      const loginRes = await pca!.loginPopup(request);
      const tokenRes = await pca!.acquireTokenSilent({ ...request, account: loginRes.account! });
      return tokenRes.accessToken;
    } catch (e) {
      console.error("MSAL token acquisition failed", e);
      return null;
    }
  }
}