# Pokémon SA Shopify Setup

This project is ready for a Headless Shopify connection without changing the current UI.

## Required Credentials

Create a Shopify custom app in Shopify Admin:

1. Open Shopify Admin.
2. Go to **Settings**.
3. Open **Apps and sales channels**.
4. Open **Develop apps**.
5. Create or open the Pokémon SA custom app.
6. Configure Admin API scopes.
7. Install the app.
8. Copy the **Admin API access token**.

Required Admin API scopes for the import script:

- `read_products`
- `write_products`
- `read_inventory`
- `write_inventory`

Create a Storefront API token:

1. Open the same custom app in Shopify Admin.
2. Configure **Storefront API** access.
3. Enable product and collection read access, cart, and checkout permissions.
4. Copy the **Storefront API access token**.

## Local Import

Create a local `.env` file or export these values in your shell:

```bash
export SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
export SHOPIFY_ADMIN_API_ACCESS_TOKEN="shpat_..."
export SHOPIFY_API_VERSION="2026-07"
export SHOPIFY_DEFAULT_INVENTORY="25"
```

Then run:

```bash
npm run shopify:import
```

The importer creates or updates:

- Featured
- Cards
- Boosters
- Magnets
- Cups
- Apparel
- Custom Cups
- Custom Apparel

It imports existing local products, custom cup products, custom apparel products, images, prices, descriptions, inventory, tags, collections, and Pokémon SA metafields.

## Storefront Runtime

Add these public browser-safe variables locally and in Vercel:

```bash
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_API_TOKEN=your_storefront_token
VITE_SHOPIFY_API_VERSION=2026-07
```

The app starts with the local catalog immediately and replaces product/collection data with Shopify Storefront API data when these variables are configured.

Do not add the Admin API access token to Vercel or any `VITE_` variable.
