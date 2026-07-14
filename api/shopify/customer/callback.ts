import {
  clearOAuthStateCookie,
  exchangeAuthorizationCode,
  getCallbackUri,
  getOAuthStateCookie,
  getQueryParam,
  redirect,
  safeCompare,
  sendJson,
  setCustomerSessionCookie,
  type ApiRequest,
  type ApiResponse,
} from "./_utils";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method && req.method !== "GET") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  try {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    const stored = getOAuthStateCookie(req);

    if (!code || !state || !stored || !safeCompare(stored.state, state)) {
      clearOAuthStateCookie(req, res);
      redirect(res, "/?account_error=shopify_customer_state");
      return;
    }

    const session = await exchangeAuthorizationCode(code, stored.codeVerifier, getCallbackUri(req));
    setCustomerSessionCookie(req, res, session);
    clearOAuthStateCookie(req, res);
    redirect(res, stored.returnTo || "/");
  } catch {
    clearOAuthStateCookie(req, res);
    redirect(res, "/?account_error=shopify_customer_auth");
  }
}
