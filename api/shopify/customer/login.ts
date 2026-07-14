import {
  customerAuthConfigured,
  discoverOAuth,
  generatePkce,
  getCallbackUri,
  getCustomerAccountClientId,
  getQueryParam,
  randomToken,
  redirect,
  sanitizeReturnTo,
  sendJson,
  setOAuthStateCookie,
  type ApiRequest,
  type ApiResponse,
} from "./_utils";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method && req.method !== "GET") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  if (!customerAuthConfigured()) {
    sendJson(res, 503, { error: "shopify_customer_accounts_not_configured" });
    return;
  }

  try {
    const discovery = await discoverOAuth();
    const { codeVerifier, codeChallenge } = generatePkce();
    const state = randomToken();
    const nonce = randomToken();
    const returnTo = sanitizeReturnTo(req, getQueryParam(req, "return_to"));
    const locale = getQueryParam(req, "locale");

    setOAuthStateCookie(req, res, {
      state,
      nonce,
      codeVerifier,
      returnTo,
      createdAt: Date.now(),
    });

    const authorizationUrl = new URL(discovery.authorization_endpoint);
    authorizationUrl.searchParams.set("client_id", getCustomerAccountClientId());
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("redirect_uri", getCallbackUri(req));
    authorizationUrl.searchParams.set("scope", "openid email customer-account-api:full");
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set("nonce", nonce);
    authorizationUrl.searchParams.set("code_challenge", codeChallenge);
    authorizationUrl.searchParams.set("code_challenge_method", "S256");
    authorizationUrl.searchParams.set("region_country", "SA");
    if (locale === "ar" || locale === "en") authorizationUrl.searchParams.set("locale", locale);

    redirect(res, authorizationUrl.toString());
  } catch {
    sendJson(res, 500, { error: "shopify_customer_login_failed" });
  }
}
