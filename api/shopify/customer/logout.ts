import {
  clearCustomerSessionCookie,
  discoverOAuth,
  getCustomerSessionCookie,
  getLogoutUri,
  redirect,
  sendJson,
  type ApiRequest,
  type ApiResponse,
} from "./_utils";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method && req.method !== "GET" && req.method !== "POST") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  const session = getCustomerSessionCookie(req);
  clearCustomerSessionCookie(req, res);

  try {
    const discovery = await discoverOAuth();
    if (discovery.end_session_endpoint && session?.idToken) {
      const logoutUrl = new URL(discovery.end_session_endpoint);
      logoutUrl.searchParams.set("id_token_hint", session.idToken);
      logoutUrl.searchParams.set("post_logout_redirect_uri", getLogoutUri(req));
      redirect(res, logoutUrl.toString());
      return;
    }
  } catch {
    // Fall through to the local logout redirect.
  }

  redirect(res, getLogoutUri(req));
}
