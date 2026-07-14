import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

export type ApiRequest = IncomingMessage & {
  body?: unknown;
  query?: Record<string, string | string[]>;
};

export type ApiResponse = ServerResponse;

export type OAuthDiscovery = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
};

export type CustomerApiDiscovery = {
  graphql_api: string;
};

export type CustomerTokenResponse = {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
};

export type CustomerSession = {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
};

export type CustomerOAuthState = {
  state: string;
  nonce: string;
  codeVerifier: string;
  returnTo: string;
  createdAt: number;
};

const SESSION_COOKIE = "pokemon_sa_customer_session";
const OAUTH_COOKIE = "pokemon_sa_customer_oauth";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const OAUTH_MAX_AGE_SECONDS = 10 * 60;
const TOKEN_REFRESH_WINDOW_MS = 60 * 1000;

const encoder = new TextEncoder();

const stripProtocol = (value: string) => value.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const getStoreDomain = () => stripProtocol(process.env.SHOPIFY_STORE_DOMAIN || process.env.VITE_SHOPIFY_STORE_DOMAIN || "");

export const getApiVersion = () => process.env.SHOPIFY_API_VERSION || process.env.VITE_SHOPIFY_API_VERSION || "2026-07";

export const getCustomerAccountClientId = () => process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID || "";

const getCustomerAccountClientSecret = () => process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET || "";

const getStorefrontAccessToken = () => process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || "";

const getSessionSecret = () => process.env.SHOPIFY_CUSTOMER_SESSION_SECRET || "";

export const getOrigin = (req: ApiRequest) => {
  const host = req.headers.host || "www.pokemon-sa.com";
  const proto = req.headers["x-forwarded-proto"] || (String(host).includes("localhost") ? "http" : "https");
  return `${Array.isArray(proto) ? proto[0] : proto}://${host}`;
};

export const getCallbackUri = (req: ApiRequest) =>
  process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI || `${getOrigin(req)}/api/shopify/customer/callback`;

export const getLogoutUri = (req: ApiRequest) => process.env.SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_REDIRECT_URI || getOrigin(req) || "https://www.pokemon-sa.com/";

export const customerAuthConfigured = () => Boolean(getStoreDomain() && getCustomerAccountClientId() && getSessionSecret());

export const sendJson = (res: ApiResponse, statusCode: number, payload: unknown) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
};

export const redirect = (res: ApiResponse, location: string) => {
  res.statusCode = 302;
  res.setHeader("Location", location);
  res.end();
};

const normalizeQueryValue = (value: string | string[] | null | undefined) => (Array.isArray(value) ? value[0] : value || "");

export const getRequestUrl = (req: ApiRequest) => new URL(req.url || "/", getOrigin(req));

export const getQueryParam = (req: ApiRequest, name: string) => {
  const fromQuery = normalizeQueryValue(req.query?.[name]);
  if (fromQuery) return fromQuery;
  return getRequestUrl(req).searchParams.get(name) || "";
};

export const sanitizeReturnTo = (req: ApiRequest, value: string) => {
  if (!value) return "/";
  try {
    if (value.startsWith("/")) return value;
    const target = new URL(value);
    const current = new URL(getOrigin(req));
    return target.host === current.host || target.host.endsWith("pokemon-sa.com") ? target.toString() : "/";
  } catch {
    return "/";
  }
};

const base64Url = (input: Buffer | string) =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const fromBase64Url = (value: string) => Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64");

export const generatePkce = () => {
  const codeVerifier = base64Url(randomBytes(64));
  const codeChallenge = base64Url(createHash("sha256").update(codeVerifier).digest());
  return { codeVerifier, codeChallenge };
};

export const randomToken = () => base64Url(randomBytes(32));

const getEncryptionKey = () => {
  const secret = getSessionSecret();
  if (!secret) throw new Error("customer_session_secret_missing");
  return createHash("sha256").update(secret).digest();
};

const encryptJson = (payload: unknown) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [base64Url(iv), base64Url(tag), base64Url(encrypted)].join(".");
};

const decryptJson = <T>(value: string): T | null => {
  try {
    const [ivRaw, tagRaw, encryptedRaw] = value.split(".");
    if (!ivRaw || !tagRaw || !encryptedRaw) return null;
    const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), fromBase64Url(ivRaw));
    decipher.setAuthTag(fromBase64Url(tagRaw));
    const decrypted = Buffer.concat([decipher.update(fromBase64Url(encryptedRaw)), decipher.final()]);
    return JSON.parse(decrypted.toString("utf8")) as T;
  } catch {
    return null;
  }
};

export const parseCookies = (req: ApiRequest) => {
  const header = req.headers.cookie;
  if (!header) return {} as Record<string, string>;
  return header.split(";").reduce<Record<string, string>>((cookies, cookie) => {
    const index = cookie.indexOf("=");
    if (index === -1) return cookies;
    const key = cookie.slice(0, index).trim();
    const value = cookie.slice(index + 1).trim();
    cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
};

const isSecureRequest = (req: ApiRequest) => {
  const proto = req.headers["x-forwarded-proto"];
  const host = String(req.headers.host || "");
  return proto === "https" || host.endsWith("pokemon-sa.com") || Boolean(process.env.VERCEL);
};

const serializeCookie = (req: ApiRequest, name: string, value: string, maxAge: number, path = "/") => {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "HttpOnly",
    "SameSite=Lax",
    `Path=${path}`,
    `Max-Age=${maxAge}`,
  ];
  if (isSecureRequest(req)) parts.push("Secure");
  return parts.join("; ");
};

const appendSetCookie = (res: ApiResponse, cookie: string) => {
  const current = res.getHeader("Set-Cookie");
  if (!current) {
    res.setHeader("Set-Cookie", cookie);
    return;
  }
  res.setHeader("Set-Cookie", Array.isArray(current) ? [...current, cookie] : [String(current), cookie]);
};

const setEncryptedCookie = (req: ApiRequest, res: ApiResponse, name: string, payload: unknown, maxAge: number, path = "/") => {
  appendSetCookie(res, serializeCookie(req, name, encryptJson(payload), maxAge, path));
};

const readEncryptedCookie = <T>(req: ApiRequest, name: string) => {
  const value = parseCookies(req)[name];
  return value ? decryptJson<T>(value) : null;
};

const clearCookie = (req: ApiRequest, res: ApiResponse, name: string, path = "/") => {
  appendSetCookie(res, serializeCookie(req, name, "", 0, path));
};

export const setOAuthStateCookie = (req: ApiRequest, res: ApiResponse, state: CustomerOAuthState) => {
  setEncryptedCookie(req, res, OAUTH_COOKIE, state, OAUTH_MAX_AGE_SECONDS, "/api/shopify/customer");
};

export const getOAuthStateCookie = (req: ApiRequest) => readEncryptedCookie<CustomerOAuthState>(req, OAUTH_COOKIE);

export const clearOAuthStateCookie = (req: ApiRequest, res: ApiResponse) => {
  clearCookie(req, res, OAUTH_COOKIE, "/api/shopify/customer");
};

export const setCustomerSessionCookie = (req: ApiRequest, res: ApiResponse, session: CustomerSession) => {
  setEncryptedCookie(req, res, SESSION_COOKIE, session, SESSION_MAX_AGE_SECONDS);
};

export const clearCustomerSessionCookie = (req: ApiRequest, res: ApiResponse) => {
  clearCookie(req, res, SESSION_COOKIE);
  clearOAuthStateCookie(req, res);
};

export const getCustomerSessionCookie = (req: ApiRequest) => readEncryptedCookie<CustomerSession>(req, SESSION_COOKIE);

export const discoverOAuth = async (): Promise<OAuthDiscovery> => {
  const domain = getStoreDomain();
  if (!domain) throw new Error("shopify_store_domain_missing");
  const response = await fetch(`https://${domain}/.well-known/openid-configuration`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("openid_discovery_failed");
  return (await response.json()) as OAuthDiscovery;
};

export const discoverCustomerApi = async (): Promise<CustomerApiDiscovery> => {
  const domain = getStoreDomain();
  if (!domain) throw new Error("shopify_store_domain_missing");
  const response = await fetch(`https://${domain}/.well-known/customer-account-api`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("customer_api_discovery_failed");
  return (await response.json()) as CustomerApiDiscovery;
};

const tokenRequest = async (params: Record<string, string>) => {
  const clientId = getCustomerAccountClientId();
  if (!clientId) throw new Error("customer_client_id_missing");
  const clientSecret = getCustomerAccountClientSecret();
  const discovery = await discoverOAuth();
  const body = new URLSearchParams({ client_id: clientId, ...params });
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (clientSecret) headers.Authorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
  const response = await fetch(discovery.token_endpoint, {
    method: "POST",
    headers,
    body: body.toString(),
  });
  if (!response.ok) throw new Error("customer_token_exchange_failed");
  return (await response.json()) as CustomerTokenResponse;
};

export const exchangeAuthorizationCode = async (code: string, codeVerifier: string, redirectUri: string) => {
  const token = await tokenRequest({
    grant_type: "authorization_code",
    code,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri,
  });
  return makeCustomerSession(token);
};

const refreshCustomerToken = async (refreshToken: string) => {
  const token = await tokenRequest({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  return makeCustomerSession(token);
};

const makeCustomerSession = (token: CustomerTokenResponse): CustomerSession => {
  if (!token.access_token) throw new Error("customer_access_token_missing");
  return {
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    idToken: token.id_token,
    expiresAt: Date.now() + Math.max(1, token.expires_in || 3600) * 1000,
  };
};

export const getCustomerSession = async (req: ApiRequest, res?: ApiResponse) => {
  const session = getCustomerSessionCookie(req);
  if (!session) return null;
  if (!session.refreshToken || session.expiresAt > Date.now() + TOKEN_REFRESH_WINDOW_MS) return session;
  if (!res) return session;
  try {
    const refreshed = await refreshCustomerToken(session.refreshToken);
    const next = {
      ...refreshed,
      refreshToken: refreshed.refreshToken || session.refreshToken,
      idToken: refreshed.idToken || session.idToken,
    };
    setCustomerSessionCookie(req, res, next);
    return next;
  } catch {
    clearCustomerSessionCookie(req, res);
    return null;
  }
};

export const customerAccountQuery = async <T>(accessToken: string, query: string, variables?: Record<string, unknown>) => {
  const discovery = await discoverCustomerApi();
  const response = await fetch(discovery.graphql_api, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const payload = (await response.json()) as { data?: T; errors?: unknown };
  if (!response.ok || payload.errors) throw new Error("customer_account_query_failed");
  return payload.data as T;
};

export const storefrontQuery = async <T>(query: string, variables?: Record<string, unknown>) => {
  const domain = getStoreDomain();
  const token = getStorefrontAccessToken();
  if (!domain || !token) throw new Error("shopify_storefront_missing");
  const response = await fetch(`https://${domain}/api/${getApiVersion()}/graphql.json`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const payload = (await response.json()) as { data?: T; errors?: unknown };
  if (!response.ok || payload.errors) throw new Error("shopify_storefront_query_failed");
  return payload.data as T;
};

export const safeCompare = (a: string, b: string) => {
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  return left.byteLength === right.byteLength && timingSafeEqual(Buffer.from(left), Buffer.from(right));
};
