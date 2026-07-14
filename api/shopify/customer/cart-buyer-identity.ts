import {
  customerAuthConfigured,
  getCustomerSession,
  sendJson,
  storefrontQuery,
  type ApiRequest,
  type ApiResponse,
} from "./_utils";

type Body = {
  cartId?: string;
};

type MutationPayload = {
  cartBuyerIdentityUpdate?: {
    cart?: {
      id: string;
      checkoutUrl?: string;
    };
    userErrors?: { field?: string[]; message: string }[];
  };
};

const BUYER_IDENTITY_MUTATION = `#graphql
mutation PokemonSaCartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
    cart {
      id
      checkoutUrl
    }
    userErrors {
      field
      message
    }
  }
}`;

const readBody = async (req: ApiRequest): Promise<Body> => {
  if (req.body && typeof req.body === "object") return req.body as Body;
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Body;
  } catch {
    return {};
  }
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  if (!customerAuthConfigured()) {
    sendJson(res, 200, { attached: false, configured: false });
    return;
  }

  try {
    const body = await readBody(req);
    if (!body.cartId) {
      sendJson(res, 400, { attached: false, error: "cart_id_required" });
      return;
    }

    const session = await getCustomerSession(req, res);
    if (!session) {
      sendJson(res, 200, { attached: false, configured: true });
      return;
    }

    const payload = await storefrontQuery<MutationPayload>(BUYER_IDENTITY_MUTATION, {
      cartId: body.cartId,
      buyerIdentity: {
        customerAccessToken: session.accessToken,
        countryCode: "SA",
      },
    });
    const update = payload.cartBuyerIdentityUpdate;
    const hasErrors = Boolean(update?.userErrors?.length);
    sendJson(res, 200, {
      attached: !hasErrors,
      configured: true,
      cartId: update?.cart?.id,
      checkoutUrl: update?.cart?.checkoutUrl,
      error: hasErrors ? "buyer_identity_update_failed" : null,
    });
  } catch {
    sendJson(res, 200, { attached: false, configured: true, error: "buyer_identity_update_failed" });
  }
}
