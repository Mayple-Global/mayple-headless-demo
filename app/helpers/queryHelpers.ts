import { availableCountries, productById } from "./queries";

const getStorefrontAccessToken = () => {
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set");
  }
  return accessToken;
};

const shopifyQuery = async (query: string, variables?: unknown) => {
  const response = await fetch(
    "https://mayple-dev-store.myshopify.com/api/2025-07/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shopify-storefront-access-token": getStorefrontAccessToken(),
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  return response.json();
};

export const getShopifyLocales = async () => shopifyQuery(availableCountries);

export const getShopifyProduct = async (countryCode: string) => {
  console.log(`countryCode: ${countryCode}`);
  return shopifyQuery(productById, {
    id: "gid://shopify/Product/7208424964235",
    countryCode,
  });
};
