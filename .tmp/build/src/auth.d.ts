export type MsalConfig = {
    tenantId: string;
    spaClientId: string;
    apiScope: string;
    redirectUri?: string;
};
export declare function initMsal(cfg: MsalConfig): void;
export declare function acquireApiToken(cfg: MsalConfig): Promise<string | null>;
