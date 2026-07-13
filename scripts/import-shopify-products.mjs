#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-07";
const defaultInventory = Number(process.env.SHOPIFY_DEFAULT_INVENTORY || 25);
const storeDomain = normalizeStoreDomain(process.env.SHOPIFY_STORE_DOMAIN || "");
const adminToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN || "";
const dryRun = process.argv.includes("--dry-run");
const useExistingCollections = process.argv.includes("--use-existing-collections");
const handlesToImport = parseHandleFilter();
const publicationTarget = parseCliValue("--publish-publication") || process.env.SHOPIFY_PUBLICATION_NAME || "";

const collectionsToCreate = [
  { handle: "featured", title: "Featured", description: "Featured Pokémon SA products." },
  { handle: "cards", title: "Cards", description: "Pokémon trading cards and collector singles." },
  { handle: "boosters", title: "Boosters", description: "Sealed Pokémon booster products." },
  { handle: "magnets", title: "Magnets", description: "Pokémon character magnet products." },
  { handle: "cups", title: "Cups", description: "Pokémon SA cup products and cup customization." },
  { handle: "apparel", title: "Apparel", description: "Ready-to-wear Pokémon SA apparel." },
  { handle: "custom-cups", title: "Custom Cups", description: "Pokémon SA custom cup studio products." },
  { handle: "custom-apparel", title: "Custom Apparel", description: "Pokémon SA custom apparel studio products." },
];

function normalizeStoreDomain(value) {
  return value.replace(/^https?:\/\//, "").replace(/\/$/, "").trim();
}

function parseHandleFilter() {
  const handleArg = parseCliValue("--handles");
  if (!handleArg) return undefined;

  const handles = handleArg
    .split(",")
    .map((handle) => handle.trim())
    .filter(Boolean);

  return handles.length ? new Set(handles) : undefined;
}

function parseCliValue(name) {
  const prefix = `${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length).trim() : "";
}

function requireCredentials() {
  const missing = [];
  if (!storeDomain) missing.push("SHOPIFY_STORE_DOMAIN");
  if (!adminToken) missing.push("SHOPIFY_ADMIN_API_ACCESS_TOKEN");
  if (!missing.length) return;

  console.error(`Missing required Shopify import credentials: ${missing.join(", ")}`);
  console.error("");
  console.error("Set them only in your local shell, never with a VITE_ prefix:");
  console.error("  export SHOPIFY_STORE_DOMAIN=\"your-store.myshopify.com\"");
  console.error("  export SHOPIFY_ADMIN_API_ACCESS_TOKEN=\"shpat_...\"");
  console.error("  npm run shopify:import");
  process.exit(1);
}

function adminUrl(route) {
  return `https://${storeDomain}/admin/api/${apiVersion}${route}`;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function shopifyRest(method, route, body) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetch(adminUrl(route), {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : {};

    if (response.status === 429 && attempt < 5) {
      const retryAfter = Number(response.headers.get("retry-after") || 0);
      await sleep(Math.max(retryAfter * 1000, 1200 + attempt * 600));
      continue;
    }

    if (!response.ok) {
      throw new Error(`${method} ${route} failed (${response.status}): ${text}`);
    }

    await sleep(550);
    return payload;
  }
  throw new Error(`${method} ${route} failed: Shopify rate limit did not recover.`);
}

async function shopifyGraphql(query, variables = {}) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetch(adminUrl("/graphql.json"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({ query, variables }),
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : {};

    if (response.status === 429 && attempt < 5) {
      const retryAfter = Number(response.headers.get("retry-after") || 0);
      await sleep(Math.max(retryAfter * 1000, 1200 + attempt * 600));
      continue;
    }

    if (!response.ok || payload.errors) {
      throw new Error(`GraphQL request failed (${response.status}): ${text}`);
    }

    await sleep(550);
    return payload.data;
  }
  throw new Error("GraphQL request failed: Shopify rate limit did not recover.");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function htmlDescription(item) {
  const en = escapeHtml(item.description?.en || item.subtitle?.en || item.title);
  const ar = escapeHtml(item.description?.ar || item.subtitle?.ar || item.title);
  const specsEn = item.specs?.en?.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("") || "";
  const specsAr = item.specs?.ar?.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("") || "";

  return [
    `<p>${en}</p>`,
    ar ? `<p dir="rtl">${ar}</p>` : "",
    specsEn ? `<h3>Specifications</h3><ul>${specsEn}</ul>` : "",
    specsAr ? `<h3 dir="rtl">المواصفات</h3><ul dir="rtl">${specsAr}</ul>` : "",
  ].filter(Boolean).join("\n");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

async function loadProjectCatalog() {
  const server = await createServer({
    root: projectRoot,
    configFile: path.join(projectRoot, "vite.config.ts"),
    logLevel: "error",
    appType: "custom",
    server: { middlewareMode: true },
  });

  try {
    const productsModule = await server.ssrLoadModule("/src/data/products.ts");
    const customizationModule = await server.ssrLoadModule("/src/lib/shopify/customization.ts");
    return buildImportCatalog(productsModule.products, customizationModule);
  } finally {
    await server.close();
  }
}

function buildImportCatalog(localProducts, customization) {
  const readyProducts = localProducts.map((product) => ({
    handle: product.id,
    title: product.name.en,
    localizedTitle: product.name,
    subtitle: product.subtitle,
    description: product.description,
    price: product.price,
    category: product.category,
    productType: categoryTitle(product.category),
    featured: Boolean(product.featured),
    specs: product.specs,
    colors: product.colors,
    sizes: product.sizes,
    inventory: product.inventory,
    imageSources: unique([product.image, ...(product.gallery || [])]),
    collectionHandles: unique([product.featured ? "featured" : "", product.category === "apparel" ? "apparel" : product.category]),
  }));

  const customCupProducts = customization.cupStyles.map((style) => ({
    handle: `custom-cup-${style.id}`,
    title: style.name.en,
    localizedTitle: style.name,
    subtitle: style.finish,
    description: {
      en: `Custom ${style.name.en} from the Pokémon SA cup studio with uploaded artwork, printed text and color selection.`,
      ar: `${style.name.ar} مخصص من استوديو الكاسات في Pokémon SA مع صورة مرفوعة ونص مطبوع واختيار اللون.`,
    },
    price: style.price,
    category: "cups",
    productType: "Custom Cups",
    specs: {
      en: [style.finish.en, "Custom image or text print", "Designed in the Pokémon SA cup studio"],
      ar: [style.finish.ar, "طباعة صورة أو نص مخصص", "مصمم داخل استوديو الكاسات في Pokémon SA"],
    },
    imageSources: unique([customization.pokemonArt[0]?.image, "/src/assets/logo.png"]),
    collectionHandles: ["cups", "custom-cups"],
  }));

  const customApparelProducts = customization.garmentStyles.map((style) => ({
    handle: `custom-apparel-${style.id}`,
    title: style.name.en,
    localizedTitle: style.name,
    subtitle: { en: "Custom Pokémon SA apparel studio", ar: "استوديو ملابس Pokémon SA المخصصة" },
    description: {
      en: `${style.name.en} configured with garment color, size, Pokémon artwork and custom text.`,
      ar: `${style.name.ar} مخصص باللون والمقاس وشخصية Pokémon والنص المطبوع.`,
    },
    price: style.price,
    category: "custom-apparel",
    productType: "Custom Apparel",
    specs: {
      en: ["Custom garment color", "Custom character print", "Designed in the Pokémon SA apparel studio"],
      ar: ["لون قطعة مخصص", "طباعة شخصية مخصصة", "مصمم داخل استوديو الملابس في Pokémon SA"],
    },
    sizes: customization.apparelSizes,
    colors: customization.garmentColors,
    imageSources: unique([style.mockups.clean, ...Object.values(style.mockups)]),
    collectionHandles: ["custom-apparel"],
  }));

  return [...readyProducts, ...customCupProducts, ...customApparelProducts];
}

function categoryTitle(category) {
  const titles = {
    cards: "Cards",
    boosters: "Boosters",
    magnets: "Magnets",
    apparel: "Apparel",
    cups: "Cups",
    "custom-apparel": "Custom Apparel",
  };
  return titles[category] || "Pokémon SA";
}

function buildOptions(item) {
  const options = [];
  if (item.colors?.length) options.push({ name: "Color", values: item.colors.map((color) => color.name.en) });
  if (item.sizes?.length) options.push({ name: "Size", values: item.sizes });
  return options.length ? options : [{ name: "Title", values: ["Default Title"] }];
}

function buildVariants(item, existingVariants = []) {
  const colors = item.colors?.length ? item.colors.map((color) => color.name.en) : [undefined];
  const sizes = item.sizes?.length ? item.sizes : [undefined];
  const inventoryQuantity = Number.isFinite(Number(item.inventory)) ? Number(item.inventory) : defaultInventory;
  let index = 0;

  return colors.flatMap((color) =>
    sizes.map((size) => {
      const variant = {
        id: existingVariants[index]?.id,
        price: String(item.price),
        sku: unique([item.handle, color, size]).join("-").toUpperCase().replace(/[^A-Z0-9-]/g, ""),
        inventory_management: "shopify",
        inventory_quantity: inventoryQuantity,
        requires_shipping: true,
      };
      index += 1;
      if (color) variant.option1 = color;
      if (size) variant.option2 = size;
      if (!color && !size) variant.option1 = "Default Title";
      return variant;
    }),
  );
}

function buildTags(item) {
  return unique([
    "pokemon-sa",
    `pokemon-sa:id:${item.handle}`,
    `category:${item.category}`,
    item.category,
    item.productType,
    item.featured ? "featured" : "",
    item.featured ? "pokemon-sa:featured" : "",
    ...item.collectionHandles,
  ]).join(", ");
}

function buildMetafields(item) {
  const fields = [
    { key: "category", value: item.category, type: "single_line_text_field" },
    { key: "localized_title", value: item.localizedTitle, type: "json" },
    { key: "localized_subtitle", value: item.subtitle, type: "json" },
    { key: "localized_description", value: item.description, type: "json" },
    { key: "localized_specs", value: item.specs, type: "json" },
  ];
  if (item.colors?.length) fields.push({ key: "colors", value: item.colors, type: "json" });
  if (item.sizes?.length) fields.push({ key: "sizes", value: item.sizes, type: "json" });

  return fields.map((field) => ({
    namespace: "pokemon_sa",
    key: field.key,
    type: field.type,
    value: field.type === "json" ? JSON.stringify(field.value) : String(field.value),
  }));
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function resolveAssetPath(source) {
  const clean = source.replace(/^file:\/\//, "");
  const candidates = [];
  if (clean.startsWith("/src/")) candidates.push(path.join(projectRoot, clean.slice(1)));
  if (clean.startsWith("src/")) candidates.push(path.join(projectRoot, clean));
  if (!clean.startsWith("/") && !/^https?:\/\//i.test(clean)) candidates.push(path.join(projectRoot, clean));

  for (const candidate of candidates) {
    if (await fileExists(candidate)) return candidate;
  }

  return undefined;
}

async function toRestImage(source) {
  if (!source) return undefined;
  if (/^https?:\/\//i.test(source)) return { src: source };

  const localPath = await resolveAssetPath(source);
  if (!localPath) return undefined;

  return {
    attachment: (await readFile(localPath)).toString("base64"),
    filename: path.basename(localPath),
  };
}

async function buildProductPayload(item, existingProduct) {
  const images = (await Promise.all(item.imageSources.map(toRestImage))).filter(Boolean);
  return {
    title: item.title,
    handle: item.handle,
    body_html: htmlDescription(item),
    vendor: "Pokémon SA",
    product_type: item.productType,
    status: "active",
    tags: buildTags(item),
    options: buildOptions(item),
    variants: buildVariants(item, existingProduct?.variants || []),
    images: existingProduct?.images?.length ? undefined : images,
  };
}

async function getProductByHandle(handle) {
  const payload = await shopifyRest("GET", `/products.json?handle=${encodeURIComponent(handle)}`);
  return payload.products?.[0];
}

async function upsertProduct(item) {
  const existing = await getProductByHandle(item.handle);
  const payload = await buildProductPayload(item, existing);

  if (existing) {
    const updated = await shopifyRest("PUT", `/products/${existing.id}.json`, {
      product: { id: existing.id, ...payload },
    });
    return updated.product;
  }

  const created = await shopifyRest("POST", "/products.json", { product: payload });
  return created.product;
}

async function getCollectionByHandle(handle) {
  const payload = await shopifyRest("GET", `/custom_collections.json?handle=${encodeURIComponent(handle)}`);
  return payload.custom_collections?.[0];
}

async function upsertCollection(collection) {
  const existing = await getCollectionByHandle(collection.handle);
  const body = {
    title: collection.title,
    handle: collection.handle,
    body_html: `<p>${escapeHtml(collection.description)}</p>`,
    published: true,
  };

  if (existing) {
    const updated = await shopifyRest("PUT", `/custom_collections/${existing.id}.json`, {
      custom_collection: { id: existing.id, ...body },
    });
    return updated.custom_collection;
  }

  const created = await shopifyRest("POST", "/custom_collections.json", {
    custom_collection: body,
  });
  return created.custom_collection;
}

async function requireExistingCollection(collection) {
  const existing = await getCollectionByHandle(collection.handle);
  if (!existing) {
    throw new Error(`Required existing Shopify collection was not found: ${collection.handle}`);
  }
  return existing;
}

async function getPublicationId(target) {
  if (!target) return "";
  if (target.startsWith("gid://shopify/Publication/")) return target;

  const data = await shopifyGraphql(`
    query PokemonSaPublications {
      publications(first: 50) {
        nodes {
          id
          name
        }
      }
    }
  `);
  const publication = data.publications.nodes.find((node) => node.name === target);
  if (!publication) {
    throw new Error(`Shopify publication was not found: ${target}`);
  }
  return publication.id;
}

async function publishResource(resourceId, publicationId) {
  if (!publicationId) return;

  const data = await shopifyGraphql(
    `
      mutation PokemonSaPublishResource($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      id: resourceId,
      input: [{ publicationId }],
    },
  );
  const errors = data.publishablePublish.userErrors || [];
  if (errors.length) {
    throw new Error(`Publish failed for ${resourceId}: ${JSON.stringify(errors)}`);
  }
}

function toProductGid(productId) {
  return String(productId).startsWith("gid://shopify/Product/") ? String(productId) : `gid://shopify/Product/${productId}`;
}

async function attachProductToCollection(productId, collectionId) {
  const existing = await shopifyRest("GET", `/collects.json?product_id=${productId}&collection_id=${collectionId}`);
  if (existing.collects?.length) return existing.collects[0];

  const created = await shopifyRest("POST", "/collects.json", {
    collect: { product_id: productId, collection_id: collectionId },
  });
  return created.collect;
}

async function upsertProductMetafields(productId, metafields) {
  const existingPayload = await shopifyRest("GET", `/products/${productId}/metafields.json?namespace=pokemon_sa`);
  const existingByKey = new Map((existingPayload.metafields || []).map((field) => [field.key, field]));

  for (const metafield of metafields) {
    const existing = existingByKey.get(metafield.key);
    if (existing) {
      await shopifyRest("PUT", `/metafields/${existing.id}.json`, {
        metafield: { id: existing.id, value: metafield.value, type: metafield.type },
      });
    } else {
      await shopifyRest("POST", `/products/${productId}/metafields.json`, { metafield });
    }
  }
}

async function main() {
  console.log(`Loading Pokémon SA catalog from ${projectRoot}`);
  let importCatalog = await loadProjectCatalog();
  if (handlesToImport) {
    const availableHandles = new Set(importCatalog.map((item) => item.handle));
    const missingHandles = [...handlesToImport].filter((handle) => !availableHandles.has(handle));
    if (missingHandles.length) {
      throw new Error(`Handle filter includes products missing from the local import catalog: ${missingHandles.join(", ")}`);
    }
    importCatalog = importCatalog.filter((item) => handlesToImport.has(item.handle));
  }
  console.log(`Loaded ${importCatalog.length} products/custom products.`);

  if (dryRun) {
    const collectionCounts = collectionsToCreate.map((collection) => ({
      handle: collection.handle,
      products: importCatalog.filter((product) => product.collectionHandles.includes(collection.handle)).length,
    }));
    console.log("Dry run only. No Shopify API calls were made.");
    console.table(collectionCounts);
    return;
  }

  requireCredentials();
  const publicationId = await getPublicationId(publicationTarget);
  if (publicationId) console.log(`Publishing imported products to Shopify publication: ${publicationTarget}`);

  const collectionByHandle = new Map();
  for (const collection of collectionsToCreate) {
    const shopifyCollection = useExistingCollections ? await requireExistingCollection(collection) : await upsertCollection(collection);
    collectionByHandle.set(collection.handle, shopifyCollection);
    console.log(`Collection ready: ${collection.title} (${collection.handle})`);
  }

  for (const item of importCatalog) {
    const product = await upsertProduct(item);
    await upsertProductMetafields(product.id, buildMetafields(item));

    for (const handle of item.collectionHandles) {
      const collection = collectionByHandle.get(handle);
      if (collection) await attachProductToCollection(product.id, collection.id);
    }
    await publishResource(toProductGid(product.id), publicationId);

    console.log(`Product ready: ${item.title} (${item.handle})`);
  }

  console.log("Shopify import completed successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
