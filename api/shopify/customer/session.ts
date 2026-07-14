import {
  customerAccountQuery,
  customerAuthConfigured,
  getCustomerSession,
  sendJson,
  type ApiRequest,
  type ApiResponse,
} from "./_utils";

type CustomerAddressNode = {
  id: string;
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  firstName?: string;
  formatted?: string[];
  formattedArea?: string;
  lastName?: string;
  name?: string;
  phoneNumber?: string;
  province?: string;
  territoryCode?: string;
  zip?: string;
  zoneCode?: string;
};

type CustomerOrderNode = {
  id: string;
  name?: string;
  number?: number;
  processedAt?: string;
  financialStatus?: string;
  fulfillmentStatus?: string;
  statusPageUrl?: string;
  totalPrice?: { amount: string; currencyCode: string };
  subtotal?: { amount: string; currencyCode: string };
  totalShipping?: { amount: string; currencyCode: string };
  totalTax?: { amount: string; currencyCode: string };
  shippingAddress?: CustomerAddressNode;
  lineItems?: {
    nodes?: {
      id: string;
      name?: string;
      title?: string;
      quantity: number;
      variantTitle?: string;
      vendor?: string;
      image?: { url: string; altText?: string };
      price?: { amount: string; currencyCode: string };
      totalPrice?: { amount: string; currencyCode: string };
    }[];
  };
};

type CustomerQueryPayload = {
  customer: {
    id: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    emailAddress?: { emailAddress?: string };
    phoneNumber?: { phoneNumber?: string };
    defaultAddress?: CustomerAddressNode;
    addresses?: { nodes?: CustomerAddressNode[] };
    orders?: { nodes?: CustomerOrderNode[] };
  };
};

const CUSTOMER_QUERY = `#graphql
query PokemonSaCustomer {
  customer {
    id
    displayName
    firstName
    lastName
    emailAddress {
      emailAddress
    }
    phoneNumber {
      phoneNumber
    }
    defaultAddress {
      id
      address1
      address2
      city
      company
      country
      firstName
      formatted
      formattedArea
      lastName
      name
      phoneNumber
      province
      territoryCode
      zip
      zoneCode
    }
    addresses(first: 20) {
      nodes {
        id
        address1
        address2
        city
        company
        country
        firstName
        formatted
        formattedArea
        lastName
        name
        phoneNumber
        province
        territoryCode
        zip
        zoneCode
      }
    }
    orders(first: 20, reverse: true) {
      nodes {
        id
        name
        number
        processedAt
        financialStatus
        fulfillmentStatus
        statusPageUrl
        totalPrice {
          amount
          currencyCode
        }
        subtotal {
          amount
          currencyCode
        }
        totalShipping {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        shippingAddress {
          id
          address1
          address2
          city
          company
          country
          firstName
          formatted
          formattedArea
          lastName
          name
          phoneNumber
          province
          territoryCode
          zip
          zoneCode
        }
        lineItems(first: 20) {
          nodes {
            id
            name
            title
            quantity
            variantTitle
            vendor
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
}`;

const mapCustomer = (payload: CustomerQueryPayload) => {
  const customer = payload.customer;
  const email = customer.emailAddress?.emailAddress || "";
  const name =
    customer.displayName ||
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") ||
    email ||
    "Shopify Customer";

  return {
    id: customer.id,
    name,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email,
    phone: customer.phoneNumber?.phoneNumber || "",
    defaultAddress: customer.defaultAddress || null,
    addresses: customer.addresses?.nodes || [],
    orders: customer.orders?.nodes || [],
  };
};

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method && req.method !== "GET") {
    sendJson(res, 405, { error: "method_not_allowed" });
    return;
  }

  if (!customerAuthConfigured()) {
    sendJson(res, 200, { authenticated: false, account: null, configured: false });
    return;
  }

  try {
    const session = await getCustomerSession(req, res);
    if (!session) {
      sendJson(res, 200, { authenticated: false, account: null, configured: true });
      return;
    }

    const payload = await customerAccountQuery<CustomerQueryPayload>(session.accessToken, CUSTOMER_QUERY);
    sendJson(res, 200, { authenticated: true, account: mapCustomer(payload), configured: true });
  } catch {
    sendJson(res, 200, { authenticated: false, account: null, configured: true, error: "customer_session_failed" });
  }
}
